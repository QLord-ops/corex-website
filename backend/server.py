from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
import uuid
import re
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
    out = {}
    # Language: auto-detect. Explicit preference first; then Cyrillic → ru; German markers → de; else en when merged with frontend.
    if re.search(r"\b(deutsch|german|auf\s*deutsch)\b", msg) and not re.search(r"\b(english|englisch)\b", msg):
        out["language"] = "de"
    elif re.search(r"\b(english|englisch|in\s*english)\b", msg):
        out["language"] = "en"
    elif re.search(r"\b(по-русски|на\s*русском|русский|russian)\b", msg, re.I):
        out["language"] = "ru"
    elif re.search(r"[\u0400-\u04FF]", msg):  # Cyrillic → Russian
        out["language"] = "ru"
    # Goal: only explicit. Booking ONLY if scheduling/booking explicitly mentioned.
    if re.search(r"\b(leads|lead\s*generation|anfragen\s*generieren)\b", t):
        out["goal"] = "leads"
    elif re.search(r"\b(booking|buchung|reservierung|terminbuchung|appointment\s*booking|scheduling|terminplanung)\b", t):
        out["goal"] = "booking"  # only when scheduling/booking explicitly mentioned
    elif re.search(r"\b(sales|verkauf|e-commerce|online\s*shop)\b", t):
        out["goal"] = "sales"
    elif re.search(r"\b(brand|marke|präsenz|presence|visibility)\b", t):
        out["goal"] = "branding"
    # Website type & pages: only if explicitly stated
    if re.search(r"\b(landing|one\s*page|1\s*page|eine\s*seite)\b", t):
        out["website_type"] = "landing"
        out["pages"] = "1"
    elif re.search(r"\b(8[-–]10\s*pages?|10[-–]page|multi[- ]?page|mehrseitig|5[-–]8|several\s*pages|list\s+of\s+pages|seitenliste)\b", t):
        out["website_type"] = "multi-page"
        out["pages"] = "8-10" if re.search(r"\b(8[-–]10\s*pages?|10[-–]page)\b", t) else "5-8"
    elif re.search(r"\b(e-commerce|online\s*store|shop)\b", t):
        out["website_type"] = "e-commerce"
    # STRICT TIMELINE PRESERVATION: output exactly as stated. Do not convert to ranges.
    if re.search(r"\b(asap|so\s*schnell|as\s*soon\s*as|schnell\s*wie\s*möglich|möglichst\s*schnell|so\s*bald\s*wie)\b", t):
        out["timeline"] = "asap"
    elif re.search(r"\b(flexible|flexibel|keine\s*eile|no\s*rush|unverbindlich)\b", t):
        out["timeline"] = "flexible"
    elif re.search(r"\b(2-4|2–4|2\s*-\s*4)\s*(weeks?|wochen?)\b", t):
        out["timeline"] = "2-4-weeks"
    elif re.search(r"\b(1-2|1–2|1\s*-\s*2)\s*(months?|monate?)\b", t):
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
    # Budget: only explicit
    if re.search(r"\b(bis\s*2\.?000|up\s*to\s*€?2|low\s*budget|günstig|cheap|kleines\s*budget)\b", t):
        out["budget_range"] = "low"
    elif re.search(r"\b(2\.?000\s*[-–]\s*4\.?000|4\.?000\s*[-–]\s*8\.?000)\b", t):
        out["budget_range"] = "mid"
    elif re.search(r"\b(über\s*8|over\s*€?8|high)\b", t):
        out["budget_range"] = "high"
    # Languages needed: only when explicitly stated (bilingual, two languages, in DE and EN)
    langs = []
    if re.search(r"\b(zweisprachig|bilingual|two\s*languages|zwei\s*sprachen|deutsch\s*und\s*englisch|german\s*and\s*english)\b", t):
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
        if re.search(r"\b(automation|e-mail\s*automation|e-mail-automatisierung|mailchimp)\b", t):
            ints.append("automation")
    if not re.search(r"\b(no|without|keine|ohne|nicht)\s*(subscription|abonnement|recurring)\b", t):
        if re.search(r"\b(subscription|abonnement|recurring\s*payment|wiederkehrende\s*zahlung|abo)\b", t):
            ints.append("subscription")
    if ints:
        out["integrations"] = list(dict.fromkeys(ints))
    # Scalability: only when explicitly mentioned
    if re.search(r"\b(scalability|scalable|skalierbar|skalierung|platform-level|platform\s*level)\b", t):
        out["scalability_required"] = True
    # City: only explicit (in X, from X, city X, based in X)
    city_m = re.search(r"(?:in|from|stadt|city|based\s+in)\s+([a-zäöüß\s\-]{2,50})", t, re.I)
    if city_m:
        out["city"] = city_m.group(1).strip().title()[:60]
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


class ExtractRequest(BaseModel):
    currentIntake: Optional[dict] = None
    userMessage: str = ""

@api_router.post("/extract")
async def extract_intake(body: ExtractRequest):
    msg = (body.userMessage or "").strip()
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


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()