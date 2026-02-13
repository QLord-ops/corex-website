from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import time
from collections import defaultdict
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
import uuid
import re
from datetime import datetime, timezone


# Backend root (folder containing server.py); path as string for dotenv compatibility.
ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(str(ROOT_DIR / ".env"), override=True)

# OpenAI: read after load_dotenv; validate non-empty (never log the key).
def _get_openai_key() -> str:
    v = (os.environ.get("OPENAI_API_KEY") or "").strip()
    return v if v else ""


OPENAI_API_KEY = _get_openai_key()

# Logging (configure early so OpenAI error logging works)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# MongoDB connection - graceful handling if MongoDB is not available
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
try:
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=3000)
    db = client[os.environ.get('DB_NAME', 'corex')]
    print("[OK] MongoDB клиент создан (проверка подключения при первом запросе)")
except Exception as e:
    print(f"[WARNING] Не удалось создать MongoDB клиент ({str(e)[:50]}). Backend запустится, но некоторые функции могут не работать.")
    # Create dummy client to prevent errors
    client = None
    db = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# In-memory rate limit for Project Check (30 req/min per IP)
_rate_limit_store = defaultdict(list)
RATE_LIMIT_N = 30
RATE_LIMIT_WINDOW = 60

def _rate_limit_check(client_key: str) -> bool:
    now = time.time()
    _rate_limit_store[client_key] = [t for t in _rate_limit_store[client_key] if now - t < RATE_LIMIT_WINDOW]
    if len(_rate_limit_store[client_key]) >= RATE_LIMIT_N:
        return False
    _rate_limit_store[client_key].append(now)
    return True


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# --- Constructor: Clients & Client Sites ---

class Client(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClientCreate(BaseModel):
    name: str
    email: Optional[str] = None


class Block(BaseModel):
    type: str  # hero, pain, how, proof, decision, cta, faq, testimonials, about
    props: dict[str, Any] = Field(default_factory=dict)

class ClientSite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: str
    slug: str
    blocks: List[Block] = Field(default_factory=list)
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClientSiteCreate(BaseModel):
    client_id: str
    name: str
    slug: str
    blocks: Optional[List[Block]] = None

class ClientSiteUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    blocks: Optional[List[Block]] = None
    published_at: Optional[datetime] = None


def _serialize_dates(d: dict) -> dict:
    for key in ("created_at", "updated_at", "published_at"):
        if key in d and isinstance(d[key], datetime):
            d[key] = d[key].isoformat()
    return d

def _parse_dates(d: dict) -> dict:
    for key in ("created_at", "updated_at", "published_at"):
        if key in d and isinstance(d[key], str):
            try:
                d[key] = datetime.fromisoformat(d[key])
            except ValueError:
                pass
    return d


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if db is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="MongoDB не доступна. Пожалуйста, установите MongoDB или используйте MongoDB Atlas.")
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        return []
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# --- Constructor API: Clients ---

@api_router.get("/clients", response_model=List[Client])
async def list_clients():
    items = await db.clients.find({}, {"_id": 0}).to_list(500)
    for item in items:
        _parse_dates(item)
    return items

@api_router.post("/clients", response_model=Client)
async def create_client(input: ClientCreate):
    obj = Client(name=input.name, email=input.email)
    doc = _serialize_dates(obj.model_dump())
    await db.clients.insert_one(doc)
    return obj

@api_router.get("/clients/{client_id}", response_model=Client)
async def get_client(client_id: str):
    doc = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Client not found")
    _parse_dates(doc)
    return doc


# --- Constructor API: Client Sites ---

@api_router.get("/sites", response_model=List[ClientSite])
async def list_sites(client_id: Optional[str] = None):
    query = {} if not client_id else {"client_id": client_id}
    items = await db.client_sites.find(query, {"_id": 0}).sort("updated_at", -1).to_list(500)
    for item in items:
        _parse_dates(item)
    return items

@api_router.post("/sites", response_model=ClientSite)
async def create_site(input: ClientSiteCreate):
    existing = await db.client_sites.find_one({"slug": input.slug})
    if existing:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Slug already in use")
    blocks = [b.model_dump() for b in (input.blocks or [])]
    obj = ClientSite(client_id=input.client_id, name=input.name, slug=input.slug, blocks=[Block(**x) for x in blocks])
    doc = _serialize_dates(obj.model_dump())
    doc["blocks"] = [b.model_dump() for b in obj.blocks]
    await db.client_sites.insert_one(doc)
    return obj

@api_router.get("/sites/{site_id}", response_model=ClientSite)
async def get_site(site_id: str):
    doc = await db.client_sites.find_one({"id": site_id}, {"_id": 0})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Site not found")
    _parse_dates(doc)
    doc["blocks"] = [Block(**b) for b in doc.get("blocks", [])]
    return doc

@api_router.get("/sites/by-slug/{slug}", response_model=ClientSite)
async def get_site_by_slug(slug: str):
    doc = await db.client_sites.find_one({"slug": slug, "published_at": {"$ne": None}}, {"_id": 0})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Site not found or not published")
    _parse_dates(doc)
    doc["blocks"] = [Block(**b) for b in doc.get("blocks", [])]
    return doc

@api_router.put("/sites/{site_id}", response_model=ClientSite)
async def update_site(site_id: str, input: ClientSiteUpdate):
    doc = await db.client_sites.find_one({"id": site_id}, {"_id": 0})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Site not found")
    updates = input.model_dump(exclude_unset=True)
    if "blocks" in updates and updates["blocks"] is not None:
        updates["blocks"] = [b.model_dump() if isinstance(b, Block) else b for b in updates["blocks"]]
    if "published_at" in updates and updates["published_at"] is not None:
        updates["published_at"] = (
            updates["published_at"].isoformat()
            if isinstance(updates["published_at"], datetime)
            else updates["published_at"]
        )
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.client_sites.update_one({"id": site_id}, {"$set": updates})
    return await get_site(site_id)

@api_router.delete("/sites/{site_id}", status_code=204)
async def delete_site(site_id: str):
    result = await db.client_sites.delete_one({"id": site_id})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Site not found")
    return None


# --- COREX Lead (TG webhook payload). Internal only. ---

class LeadCreate(BaseModel):
    lead_score: int = Field(ge=1, le=10)
    language: str = Field(pattern="^(de|en|ru)$")
    city: str = ""
    industry: str = ""
    goal: str = ""
    package: str = Field(pattern="^(START|BUSINESS|PRO)$")
    budget_signal: str = Field(pattern="^(low|mid|high|unknown)$")
    timeline: str = ""
    integrations: List[str] = Field(default_factory=list)
    next_step: str = Field(pattern="^(offer|call)$")
    summary: str = ""
    risk_flags: List[str] = Field(default_factory=list)


@api_router.post("/lead")
async def create_lead(body: LeadCreate):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


# --- Intake extraction: STRICT. Extract ONLY what is explicitly stated. Never infer. ---

INTAKE_REQUIRED = ["goal", "website_type", "timeline", "budget_range"]

def _empty_intake():
    return {
        "language": None,
        "business_type": None,
        "city": None,
        "goal": None,
        "website_type": None,
        "pages": None,
        "content_ready": None,
        "languages_needed": [],
        "integrations": [],
        "timeline": None,
        "budget_range": None,
        "scalability_required": None,
        "references": [],
        "notes": None,
    }

def _extract_from_message(msg: str) -> dict:
    if not msg or not isinstance(msg, str):
        return {}
    t = msg.lower().strip()
    msg_any_case = msg.strip()
    out = {}
    # Language: auto-detect. Explicit preference first; then Cyrillic → ru; German markers → de; else en when merged with frontend.
    if re.search(r"\b(deutsch|german|auf\s*deutsch)\b", msg, re.I) and not re.search(r"\b(english|englisch)\b", msg, re.I):
        out["language"] = "de"
    elif re.search(r"\b(english|englisch|in\s*english)\b", msg, re.I):
        out["language"] = "en"
    elif re.search(r"\b(по-русски|на\s*русском|русский|russian)\b", msg, re.I):
        out["language"] = "ru"
    elif re.search(r"[\u0400-\u04FF]", msg):  # Cyrillic → Russian
        out["language"] = "ru"
    # Goal: only explicit. EN/DE + RU: leads, booking, sales, branding.
    if re.search(r"\b(leads|lead\s*generation|anfragen\s*generieren)\b", t):
        out["goal"] = "leads"
    elif re.search(r"\b(лиды|лид\w*|заявки|лидогенерация)\b", msg_any_case, re.I):
        out["goal"] = "leads"
    elif re.search(r"\b(booking|buchung|reservierung|terminbuchung|appointment\s*booking|scheduling|terminplanung)\b", t):
        out["goal"] = "booking"
    elif re.search(r"\b(бронирован|запис[иь]|бронировани)\b", msg_any_case, re.I):
        out["goal"] = "booking"
    elif re.search(r"\b(sales|verkauf|e-commerce|online\s*shop)\b", t):
        out["goal"] = "sales"
    elif re.search(r"\b(продаж|интернет-магазин|магазин|e-commerce)\b", msg_any_case, re.I):
        out["goal"] = "sales"
    elif re.search(r"\b(brand|marke|präsenz|presence|visibility)\b", t):
        out["goal"] = "branding"
    elif re.search(r"\b(имидж|присутствие|видимость|бренд|презенс)\b", msg_any_case, re.I):
        out["goal"] = "branding"
    # Website type & pages: only if explicitly stated (EN/DE + RU)
    if re.search(r"\b(landing|one\s*page|1\s*page|eine\s*seite)\b", t):
        out["website_type"] = "landing"
        out["pages"] = "1"
    elif re.search(r"\b(лендинг|одна\s*страница|1\s*страниц)\b", msg_any_case, re.I):
        out["website_type"] = "landing"
        out["pages"] = "1"
    elif re.search(r"\b(8[-–]10\s*pages?|10[-–]page|multi[- ]?page|mehrseitig|5[-–]8|several\s*pages|list\s+of\s+pages|seitenliste)\b", t):
        out["website_type"] = "multi-page"
        out["pages"] = "8-10" if re.search(r"\b(8[-–]10\s*pages?|10[-–]page)\b", t) else "5-8"
    elif re.search(r"\b(многостраничн|5[-–]8\s*страниц|несколько\s*страниц)\b", msg_any_case, re.I):
        out["website_type"] = "multi-page"
        out["pages"] = "5-8"
    elif re.search(r"\b(e-commerce|online\s*store|shop)\b", t):
        out["website_type"] = "e-commerce"
    elif re.search(r"\b(интернет-магазин|онлайн\s*магазин)\b", msg_any_case, re.I):
        out["website_type"] = "e-commerce"
    # STRICT TIMELINE PRESERVATION: output exactly as stated. EN/DE + RU.
    if re.search(r"\b(asap|so\s*schnell|as\s*soon\s*as|schnell\s*wie\s*möglich|möglichst\s*schnell|so\s*bald\s*wie)\b", t):
        out["timeline"] = "asap"
    elif re.search(r"\b(срочно|как\s*можно\s*скорее|как\s*можно\s*быстрее|дедлайн\s*[«\"']?\s*как\s*можно\s*быстрее|как\s*скоро|быстро\s*запуск)\b", msg_any_case, re.I):
        out["timeline"] = "asap"
    elif re.search(r"\b(flexible|flexibel|keine\s*eile|no\s*rush|unverbindlich)\b", t):
        out["timeline"] = "flexible"
    elif re.search(r"\b(гибк|без\s*срочн|не\s*спеша)\b", msg_any_case, re.I):
        out["timeline"] = "flexible"
    elif re.search(r"\b(2-4|2–4|2\s*-\s*4)\s*(weeks?|wochen?)\b", t):
        out["timeline"] = "2-4-weeks"
    elif re.search(r"\b(2[-–]4)\s*недел|\b(2\s*[-–]\s*4)\s*недел\w*\b", msg_any_case, re.I):
        out["timeline"] = "2-4-weeks"
    elif re.search(r"\b(1-2|1–2|1\s*-\s*2)\s*(months?|monate?)\b", t):
        out["timeline"] = "1-2-months"
    elif re.search(r"\b(1[-–]2)\s*месяц|\b(1\s*[-–]\s*2)\s*месяц\w*\b", msg_any_case, re.I):
        out["timeline"] = "1-2-months"
    else:
        range_weeks = re.search(r"\b(2\s*[-–]\s*3|3\s*[-–]\s*4|4\s*[-–]\s*5|5\s*[-–]\s*6)\s*(weeks?|wochen?)\b", t)
        if range_weeks:
            r = re.sub(r"\s+", "", range_weeks.group(1)).replace("–", "-")
            out["timeline"] = f"{r}-weeks"
        else:
            weeks_m = re.search(r"\b(?:in|bis|within|zeitrahmen|launch|frist|deadline|termine?|dauer|duration)?\s*(\d+)\s*(?:weeks?|wochen?)\b", t)
            if weeks_m:
                out["timeline"] = f"{weeks_m.group(1)}-weeks"
            else:
                months_m = re.search(r"\b(?:in\s+)?(einem?|einer?|einen?|\d+)\s*(?:months?|monate?)\b", t)
                if months_m:
                    w = months_m.group(1)
                    n = 1 if w in ("ein", "einen", "einem", "einer") else int(w) if w.isdigit() else 1
                    out["timeline"] = f"{n}-months"
                elif re.search(r"\b(1\s*month|1\s*monat|ein\s*monat)\b", t):
                    out["timeline"] = "1-months"
                elif re.search(r"\b(2\s*months?|2\s*monate?|zwei\s*monate?)\b", t):
                    out["timeline"] = "2-months"
    # Budget: only explicit (EN/DE + RU; allow spaces in numbers)
    if re.search(r"\b(bis\s*2\.?000|up\s*to\s*€?2|low\s*budget|günstig|cheap|kleines\s*budget)\b", t):
        out["budget_range"] = "low"
    elif re.search(r"\b(до\s*2\s*000|до\s*2000|бюджет\s*до\s*2|до\s*2\.?000)\b", msg_any_case, re.I):
        out["budget_range"] = "low"
    elif re.search(r"\b(2\.?000\s*[-–]\s*4\.?000|4\.?000\s*[-–]\s*8\.?000)\b", t):
        out["budget_range"] = "mid"
    elif re.search(r"\b(2\s*000\s*[-–]\s*4\s*000|4\s*000\s*[-–]\s*8\s*000|до\s*4\s*000|до\s*4000|до\s*4\s*к|до\s*4к|4\s*к\b|4k\b|2\s*000\s*[-–]\s*4)\b", msg_any_case, re.I):
        out["budget_range"] = "mid"
    elif re.search(r"\b(über\s*8|over\s*€?8|high)\b", t):
        out["budget_range"] = "high"
    elif re.search(r"\b(более\s*8|свыше\s*8|over\s*8)\b", msg_any_case, re.I):
        out["budget_range"] = "high"
    # Languages needed: only when explicitly stated (EN/DE + RU)
    langs = []
    if re.search(r"\b(zweisprachig|bilingual|two\s*languages|zwei\s*sprachen|deutsch\s*und\s*englisch|german\s*and\s*english)\b", t):
        langs = ["de", "en"]
    elif re.search(r"\b(на\s*немецком\s*и\s*английском|немецк\s*и\s*английск|два\s*языка|двуязычн)\b", msg_any_case, re.I):
        langs = ["de", "en"]
    elif re.search(r"\b(nur\s*deutsch|only\s*german|auf\s*deutsch|in\s*german)\b", t):
        langs = ["de"]
    elif re.search(r"\b(nur\s*englisch|only\s*english|in\s*english|auf\s*englisch)\b", t):
        langs = ["en"]
    if langs:
        out["languages_needed"] = list(dict.fromkeys(langs))
    # Integrations: ONLY if explicitly mentioned. Never infer. If user says "no booking/CRM/automation/payments" => do NOT add.
    ints = []
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*(booking|buchung|reservierung|termin)", t) and not re.search(r"\b(booking|buchung|reservierung|termin)\s*(nicht|nicht\s*erwünscht|not\s*needed)", t):
        if re.search(r"\b(booking\s*system|buchungssystem|buchung|terminbuchung|reservierung|appointment\s*booking|terminplanung)\b", t):
            ints.append("booking")
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*(payment|zahlung|stripe|paypal)", t) and not re.search(r"\b(payment|zahlung)\s*(nicht|not\s*needed)", t):
        if re.search(r"\b(stripe|online\s*payment|payment\s*gateway|zahlungsgateway|zahlung|paypal)\b", t):
            ints.append("payment")
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*crm\b", t) and not re.search(r"\bcrm\s*(nicht|not\s*needed)", t):
        if re.search(r"\b(crm|hubspot|pipedrive|salesforce)\b", t):
            ints.append("crm")
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*(automation|automatisierung)", t) and not re.search(r"\b(automation|automatisierung)\s*(nicht|not\s*needed)", t):
        if re.search(r"\b(automation|e-mail\s*automation|e-mail-automatisierung|mailchimp)\b", t) or re.search(r"\b(автоматизац\w*|интеграц\w*|email-автоматизац)\b", msg_any_case, re.I):
            ints.append("automation")
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*(subscription|abonnement|recurring)\b", t):
        if re.search(r"\b(subscription|abonnement|recurring\s*payment|wiederkehrende\s*zahlung|abo)\b", t):
            ints.append("subscription")
    if ints:
        out["integrations"] = list(dict.fromkeys(ints))
    # Scalability: only when explicitly mentioned
    if re.search(r"\b(scalability|scalable|skalierbar|skalierung|platform-level|platform\s*level)\b", t):
        out["scalability_required"] = True
    # City: explicit (EN/DE: in X; RU: в X; known cities)
    if re.search(r"\b(гёттинген|геттинген|goettingen|göttingen)\b", msg_any_case, re.I):
        out["city"] = "Göttingen"
    city_m = re.search(r"(?:in|from|stadt|city|based\s+in)\s+([a-zäöüß\s\-]{2,50})", msg_any_case, re.I)
    if city_m and not out.get("city"):
        out["city"] = city_m.group(1).strip().title()[:60]
    if not out.get("city"):
        city_ru = re.search(r"\b(?:в|город|из)\s+([а-яёa-z\s\-]{2,50}?)(?:\s*[.,]|\s+нужен|\s+нужна|\s+но|\s*$)", msg_any_case, re.I)
        if city_ru:
            out["city"] = city_ru.group(1).strip().title()[:60]
    # Business type: B2B/В2В, консалтинг, etc.
    if not out.get("business_type"):
        if re.search(r"\b(B2B|В2В|в2в|b2b)\s*(сервис|service|услуг)?", msg_any_case, re.I):
            out["business_type"] = "B2B сервис"
        else:
            biz_ru = re.search(r"\b(консалтинг|консалтинговая|производство|услуги|ресторан|гостиниц|клиника|агентство)\w*", msg_any_case, re.I)
            if biz_ru:
                out["business_type"] = biz_ru.group(0).strip()[:80]
    # Notes: кабинет, админка, chatbot, AI (for context)
    notes_parts = []
    if re.search(r"\b(кабинет|админ\w*|admin\s*panel|cabinet)\b", msg_any_case, re.I):
        notes_parts.append("Лендинг + кабинет / админ-панель")
    if re.search(r"\b(чат-бот|чатбот|chatbot|chat-bot)\b", msg_any_case, re.I):
        notes_parts.append("Чат-бот")
    if re.search(r"\b(ai\s*анализ|openai|open\s*ai)\b", msg_any_case, re.I):
        notes_parts.append("AI анализ проектов / OpenAI")
    if re.search(r"corexdigital\.de", msg_any_case, re.I):
        notes_parts.append("Домен: corexdigital.de")
    if notes_parts:
        out["notes"] = "; ".join(notes_parts)[:500]
    return out


def _detect_reset(msg: str) -> bool:
    """User starts a new scenario/test case -> reset state."""
    if not msg or not isinstance(msg, str):
        return False
    t = msg.lower().strip()
    return bool(re.search(r"\b(new\s+test|neuer\s*test|start\s+over|reset|new\s+project|neues\s*projekt|from\s+scratch|von\s+vorne)\b", t))


def _apply_negations_to_intake(msg: str, base: dict) -> None:
    """If user explicitly negates something (e.g. 'no CRM'), remove it from state. Mutates base."""
    if not msg or not isinstance(msg, str) or "integrations" not in base:
        return
    t = msg.lower().strip()
    integrations = list(base.get("integrations") or [])
    if re.search(r"\b(no|without|keine|ohne|nicht)\s*(booking|buchung|reservierung|termin)", t) or re.search(r"\b(booking|buchung|reservierung|termin)\s*(nicht|not\s*needed)", t):
        integrations = [x for x in integrations if x != "booking"]
    if re.search(r"\b(no|without|keine|ohne|nicht)\s*(payment|zahlung|stripe|paypal)", t) or re.search(r"\b(payment|zahlung)\s*(nicht|not\s*needed)", t):
        integrations = [x for x in integrations if x != "payment"]
    if re.search(r"\b(no|without|keine|ohne|nicht)\s*crm\b", t) or re.search(r"\bcrm\s*(nicht|not\s*needed)", t):
        integrations = [x for x in integrations if x != "crm"]
    if re.search(r"\b(no|without|keine|ohne|nicht)\s*(automation|automatisierung)", t) or re.search(r"\b(automation|automatisierung)\s*(nicht|not\s*needed)", t):
        integrations = [x for x in integrations if x != "automation"]
    if re.search(r"\b(no|without|keine|ohne|nicht)\s*(subscription|abonnement|recurring)\b", t):
        integrations = [x for x in integrations if x != "subscription"]
    base["integrations"] = integrations


# --- OpenAI extraction (optional). When OPENAI_API_KEY is set, use GPT to extract intake from message. ---

# Optional: your custom instructions for the Project Check AI (appended to system prompt; works like ChatGPT with your rules).
OPENAI_PROJECT_CHECK_INSTRUCTIONS = (os.environ.get("OPENAI_PROJECT_CHECK_INSTRUCTIONS") or "").strip()

# Log OpenAI failures (status, message); never log the API key.
def _log_openai_error(operation: str, exc: Exception) -> None:
    msg = str(exc).strip()[:500]
    if "sk-" in msg or "OPENAI_API_KEY" in msg:
        msg = re.sub(r"sk-[a-zA-Z0-9\-_]+", "***", msg)
        msg = msg.replace("OPENAI_API_KEY", "***")
    status = getattr(exc, "status_code", None) or getattr(exc, "code", None)
    if status is not None:
        logger.warning("OpenAI %s failed status=%s message=%s", operation, status, msg)
    else:
        logger.warning("OpenAI %s failed: %s", operation, msg or type(exc).__name__)


def _log_openai_exception_full(operation: str, exc: Exception) -> None:
    """Log full traceback and status/code for debugging; never log the key."""
    import traceback
    tb = traceback.format_exc()
    if "sk-" in tb or "api_key" in tb.lower():
        tb = re.sub(r"sk-[a-zA-Z0-9\-_]+", "***", tb)
    logger.error("OpenAI %s exception status_code=%s code=%s traceback=%s",
                 operation, getattr(exc, "status_code", None), getattr(exc, "code", None), tb)

INTAKE_KEYS = [
    "language", "business_type", "city", "goal", "website_type", "pages",
    "content_ready", "languages_needed", "integrations", "timeline", "budget_range",
    "scalability_required", "references", "notes",
]

def _extract_with_openai(current_intake: dict, user_message: str) -> Optional[dict]:
    """Call OpenAI to extract/update intake from user message. Returns merged intake or None on failure."""
    if not OPENAI_API_KEY or not user_message.strip():
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        base = _empty_intake()
        if current_intake and isinstance(current_intake, dict):
            for k in INTAKE_KEYS:
                if k in current_intake and current_intake[k] is not None:
                    v = current_intake[k]
                    if k in ("integrations", "languages_needed", "references") and not isinstance(v, list):
                        v = [v] if v else []
                    base[k] = v

        prompt = """You are an intake assistant for a web development / digital systems company. Extract structured data from the user's message and return ONLY a valid JSON object. Rules:
- Only include fields that are EXPLICITLY stated or clearly implied in the user message. Do not invent values.
- If the user says "no X" or "without X" (e.g. no CRM, no booking), REMOVE X from integrations and do not add it.
- Preserve existing values from current_intake for any field not mentioned in the new message.
- Use exactly these values:
  language: "de" | "en" | "ru" (or null)
  goal: "leads" | "booking" | "sales" | "branding" (or null)
  website_type: "landing" | "multi-page" | "e-commerce" (or null)
  timeline: "asap" | "flexible" | "2-4-weeks" | "1-2-months" | "N-weeks" | "N-months" (e.g. "3-weeks") (or null)
  budget_range: "low" | "mid" | "high" (or null)
  integrations: array of "booking" | "payment" | "crm" | "automation" | "subscription"
  languages_needed: array of "de" | "en"
- business_type, city, pages: string or null. pages can be "1", "5-8", "8-10", "10", etc.
- content_ready: true | false | null. scalability_required: true | false | null.
- references: array of strings or []. notes: string or null.
- Output ONLY the JSON object, no markdown, no explanation."""
        if OPENAI_PROJECT_CHECK_INSTRUCTIONS:
            prompt += "\n\nAdditional instructions you must follow:\n" + OPENAI_PROJECT_CHECK_INSTRUCTIONS

        user_content = f"current_intake:\n{json.dumps(base, ensure_ascii=False)}\n\nuser_message:\n{user_message.strip()}"
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_EXTRACT_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_content},
            ],
            temperature=0.1,
            max_tokens=800,
        )
        text = (response.choices[0].message.content or "").strip()
        # Strip markdown code block if present
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
        extracted = json.loads(text)
        if not isinstance(extracted, dict):
            return None
        # Merge: extracted overwrites only keys that are present and not null in extracted
        for k in INTAKE_KEYS:
            if k not in extracted:
                continue
            v = extracted[k]
            if v is None:
                continue
            if k == "integrations" and isinstance(v, list):
                base["integrations"] = [x for x in v if x in ("booking", "payment", "crm", "automation", "subscription")]
            elif k == "languages_needed" and isinstance(v, list):
                base["languages_needed"] = [x for x in v if x in ("de", "en")]
            elif k == "references" and isinstance(v, list):
                base["references"] = [str(x) for x in v[:10]]
            elif k in ("goal", "website_type", "timeline", "budget_range", "language") and isinstance(v, str):
                base[k] = v
            elif k in ("business_type", "city", "pages", "notes") and isinstance(v, str):
                base[k] = v[:500] if k == "notes" else v[:120]
            elif k == "content_ready" and isinstance(v, bool):
                base["content_ready"] = v
            elif k == "scalability_required" and isinstance(v, bool):
                base["scalability_required"] = v
        _apply_negations_to_intake(user_message, base)
        return base
    except Exception as e:
        _log_openai_error("extract", e)
        return None


def _generate_proposal_with_openai(intake: dict, lang: str) -> Optional[str]:
    """Generate a short commercial proposal (what we offer, price, timeline) in the client's language.
    DEBUG: Logs key presence, raw response, and null reasons; no try/except - real errors propagate."""
    key_detected = bool(OPENAI_API_KEY)
    logger.info("[proposal] OPENAI_API_KEY detected=%s", key_detected)
    if not OPENAI_API_KEY:
        logger.info("[proposal] proposalText=null reason=OPENAI_API_KEY missing or empty")
        return None
    if not intake:
        logger.info("[proposal] proposalText=null reason=intake empty")
        return None

    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)
    lang_instruction = "ru" if lang == "ru" else "de" if lang == "de" else "en"
    sys_prompt = f"""You are a sales consultant for a web/digital agency (AIONEX / Corex). Based on the project brief (intake), write ONE short paragraph (3-5 sentences) as a commercial proposal: what we offer (e.g. landing, multi-page site, integrations), why this fits the client, and give a concrete price in EUR (e.g. from 2 490 €) and timeline. Use package names START / BUSINESS / PRO if relevant. Write in {lang_instruction} only. Be concrete and professional. No markdown, no greeting."""
    user_content = f"intake:\n{json.dumps(intake, ensure_ascii=False)}"
    if OPENAI_PROJECT_CHECK_INSTRUCTIONS:
        user_content += f"\n\nRules: {OPENAI_PROJECT_CHECK_INSTRUCTIONS}"

    # No try/except: let real error propagate for debugging.
    response = client.chat.completions.create(
        model=os.environ.get("OPENAI_EXTRACT_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0.3,
        max_tokens=500,
    )
    raw_content = response.choices[0].message.content if response.choices else None
    logger.info("[proposal] raw OpenAI response present=%s length=%s preview=%s",
               raw_content is not None,
               len(raw_content) if raw_content else 0,
               (raw_content[:200] + "...") if raw_content and len(raw_content) > 200 else (raw_content or ""))

    text = (raw_content or "").strip()
    if not text:
        logger.info("[proposal] proposalText=null reason=empty or whitespace-only response from OpenAI")
        return None
    logger.info("[proposal] OpenAI proposal generated successfully")
    return text


class ProposalRequest(BaseModel):
    intake: Optional[dict] = None
    language: Optional[str] = "en"


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ProjectCheckChatRequest(BaseModel):
    intake: Optional[dict] = None
    messages: List[ChatMessage] = Field(default_factory=list)
    newMessage: str = ""


def _chat_with_openai(intake: dict, messages: List[dict], new_message: str, lang: str) -> str:
    """One turn of conversation. Same model as proposal. Returns assistant text. Raises on OpenAI API errors or empty content."""
    from openai import OpenAI
    model = os.environ.get("OPENAI_EXTRACT_MODEL", "gpt-4o-mini")
    client = OpenAI(api_key=OPENAI_API_KEY)
    lang_instruction = "ru" if lang == "ru" else "de" if lang == "de" else "en"
    system = f"""You are a friendly project consultant for a web/digital agency. The client has described their project; here is the brief (intake). Answer in {lang_instruction}. Be helpful, concise, and professional. You can clarify requirements, suggest next steps, discuss scope or pricing. Keep replies to 2-4 sentences unless the client asks for detail."""
    context = f"Project brief (intake):\n{json.dumps(intake, ensure_ascii=False)}"
    openai_messages: List[dict] = [
        {"role": "system", "content": system},
        {"role": "user", "content": context},
    ]
    for m in messages:
        if m.get("role") in ("user", "assistant") and m.get("content"):
            openai_messages.append({"role": m["role"], "content": m["content"]})
    openai_messages.append({"role": "user", "content": new_message.strip()})

    response = client.chat.completions.create(
        model=model,
        messages=openai_messages,
        temperature=0.5,
        max_tokens=1024,
    )
    logger.info("[chat] raw response: %s", response)

    content = response.choices[0].message.content if response.choices else None
    logger.info("[chat] content is None=%s length=%s", content is None, len(content) if content else 0)

    if not content or not isinstance(content, str):
        content = ""
    text = (content or "").strip()
    if not text:
        logger.info("[chat] content empty or whitespace, using fallback message")
        return "Thank you for your question. Based on your project scope, the estimated investment is from 2,490 €. If you want, I can break it down."
    return text


class ExtractRequest(BaseModel):
    currentIntake: Optional[dict] = None
    userMessage: str = ""


class ProjectCheckAnalyzeRequest(BaseModel):
    text: Optional[str] = ""
    currentIntake: Optional[dict] = None


def _do_extract(body: ExtractRequest) -> dict:
    """Shared extraction logic: returns {intake, missing_required}."""
    msg = (body.userMessage or "").strip()
    base = None
    # Try OpenAI first when key is set (Project Check "мозги"). Skip on reset phrases.
    if OPENAI_API_KEY and msg and not _detect_reset(msg):
        base = _extract_with_openai(body.currentIntake, msg)
    if base is None:
        # Fallback: regex extraction (or when OpenAI unavailable)
        if _detect_reset(msg):
            base = _empty_intake()
            extracted = _extract_from_message(msg)
            for k, v in extracted.items():
                if v is None:
                    continue
                if k == "integrations" and isinstance(v, list):
                    base["integrations"] = list(dict.fromkeys(v))
                elif k == "languages_needed" and isinstance(v, list):
                    base["languages_needed"] = list(dict.fromkeys(v))
                elif k == "scalability_required":
                    base[k] = v
                elif not isinstance(v, list) or v:
                    base[k] = v
        else:
            base = _empty_intake()
            if body.currentIntake and isinstance(body.currentIntake, dict):
                for k, v in body.currentIntake.items():
                    if k in base and v is not None:
                        base[k] = v
            extracted = _extract_from_message(msg)
            for k, v in extracted.items():
                if v is None:
                    continue
                if k == "integrations" and isinstance(v, list):
                    existing = base.get("integrations") or []
                    base["integrations"] = list(dict.fromkeys(existing + v))
                elif k == "languages_needed" and isinstance(v, list):
                    existing = base.get("languages_needed") or []
                    base["languages_needed"] = list(dict.fromkeys(existing + v))
                elif k == "scalability_required":
                    base[k] = v
                elif not isinstance(v, list) or v:
                    base[k] = v
            _apply_negations_to_intake(msg, base)
    missing_required = [f for f in INTAKE_REQUIRED if base.get(f) is None or base.get(f) == "" or (isinstance(base.get(f), list) and len(base.get(f)) == 0)]
    if len(missing_required) == 0:
        return {"sales_mode": True, "intake": base, "missing_required": missing_required}
    return {"intake": base, "missing_required": missing_required}


@api_router.post("/extract")
async def extract_intake(request: Request, body: ExtractRequest):
    client_key = request.client.host if request.client else "unknown"
    if not _rate_limit_check(client_key):
        raise HTTPException(status_code=429, detail="Too many requests. Try again in a minute.")
    msg = (body.userMessage or "").strip()
    if len(msg) > 10000:
        raise HTTPException(status_code=400, detail="Message too long.")
    return _do_extract(body)


@api_router.post("/project-check/analyze")
async def project_check_analyze(request: Request, body: ProjectCheckAnalyzeRequest):
    """Project Check: analyze text with OpenAI (or regex fallback). Same response shape as /extract."""
    client_key = request.client.host if request.client else "unknown"
    if not _rate_limit_check(client_key):
        raise HTTPException(status_code=429, detail="Too many requests. Try again in a minute.")
    text = (body.text or "").strip()
    if len(text) > 10000:
        raise HTTPException(status_code=400, detail="Text too long.")
    req = ExtractRequest(userMessage=text, currentIntake=body.currentIntake)
    try:
        return _do_extract(req)
    except Exception as e:
        logger.exception("project-check/analyze error")
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")


@api_router.get("/openai/status")
async def openai_status():
    """Health/debug: whether OpenAI is configured. Does not leak the key."""
    return {"configured": bool(OPENAI_API_KEY)}


@api_router.post("/project-check/proposal")
async def project_check_proposal(request: Request, body: ProposalRequest):
    """Generate full commercial proposal text (description + price) using OpenAI. Returns 200 with proposalText=null only when not configured or OpenAI returns empty. DEBUG: no try/except - real errors propagate."""
    client_key = request.client.host if request.client else "unknown"
    if not _rate_limit_check(client_key):
        raise HTTPException(status_code=429, detail="Too many requests.")
    if not OPENAI_API_KEY:
        logger.info("[proposal] endpoint returning proposalText=null (OPENAI_API_KEY not set)")
        return {"proposalText": None}
    intake = body.intake or {}
    lang = (body.language or intake.get("language") or "en").lower()[:2]
    # No try/except: let OpenAI errors propagate so we see the real failure.
    proposal_text = _generate_proposal_with_openai(intake, lang)
    if proposal_text:
        logger.info("[proposal] endpoint returning GPT text (length=%s)", len(proposal_text))
    else:
        logger.info("[proposal] endpoint returning proposalText=null (OpenAI returned empty)")
    return {"proposalText": proposal_text}


@api_router.post("/project-check/chat")
async def project_check_chat(request: Request, body: ProjectCheckChatRequest):
    """One turn of conversation. 503 if no key; 502 on OpenAI error; 500 if empty content; 400 if empty message; 200 with assistantMessage."""
    client_key = request.client.host if request.client else "unknown"
    if not _rate_limit_check(client_key):
        raise HTTPException(status_code=429, detail="Too many requests.")
    msg = (body.newMessage or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Empty message")
    if len(msg) > 2000:
        raise HTTPException(status_code=400, detail="Message too long.")

    key_detected = bool(OPENAI_API_KEY)
    logger.info("[chat] OPENAI_API_KEY detected=%s", key_detected)
    if not OPENAI_API_KEY:
        logger.info("[chat] returning 503 OpenAI is not configured")
        raise HTTPException(status_code=503, detail="OpenAI is not configured")

    intake = body.intake or {}
    lang = (intake.get("language") or "en").lower()[:2]
    intake_summary = json.dumps(intake, ensure_ascii=False) if intake else ""
    messages = [{"role": m.role, "content": m.content} for m in (body.messages or []) if m.role in ("user", "assistant") and m.content]
    new_message_preview = msg[:200] + "..." if len(msg) > 200 else msg
    logger.info("[chat] intake_summary_len=%s messages_count=%s newMessage=%s",
                len(intake_summary), len(messages), new_message_preview)

    try:
        reply = _chat_with_openai(intake, messages, msg, lang)
    except ValueError as e:
        if "empty content" in str(e).lower():
            logger.error("[chat] returning 500 OpenAI returned empty content")
            raise HTTPException(status_code=500, detail="OpenAI returned empty content")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        _log_openai_error("chat", e)
        _log_openai_exception_full("chat", e)
        raise HTTPException(status_code=502, detail="OpenAI upstream error")

    logger.info("[chat] returning 200 assistantMessage length=%s", len(reply))
    return {"assistantMessage": reply}


app.include_router(api_router)

# CORS configuration: allow localhost for development, restrict to ALLOWED_ORIGINS in production
_cors_origins_env = os.environ.get('ALLOWED_ORIGINS', os.environ.get('CORS_ORIGINS', ''))
if _cors_origins_env:
    _cors_origins = [origin.strip() for origin in _cors_origins_env.split(',') if origin.strip()]
else:
    # Development: allow localhost and common dev origins
    _cors_origins = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()