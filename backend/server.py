from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "corex")]

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


class ContactLeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    phone: Optional[str] = Field(default=None, max_length=64)
    message: str = Field(min_length=10, max_length=4000)
    language: str = Field(default="de", max_length=10)
    source: str = Field(default="landing_contact_form", max_length=100)
    consent: bool = True


class ContactLead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str
    language: str
    source: str
    consent: bool
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCaptureCreate(BaseModel):
    sessionId: Optional[str] = None
    consent: bool = True
    contactInfo: dict


class CtaTrackCreate(BaseModel):
    sessionId: Optional[str] = None
    action: str = Field(min_length=2, max_length=100)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/contact")
async def create_contact_lead(payload: ContactLeadCreate):
    if not payload.consent:
        return {"success": False, "message": "Consent is required."}

    lead = ContactLead(**payload.model_dump())
    doc = lead.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    _ = await db.contact_leads.insert_one(doc)
    return {"success": True, "id": lead.id}


@api_router.post("/lead/submit")
async def submit_lead_capture(payload: LeadCaptureCreate):
    if not payload.consent:
        return {"success": False, "error": "Consent is required."}

    contact_info = payload.contactInfo or {}
    lead_doc = {
        "id": str(uuid.uuid4()),
        "sessionId": payload.sessionId,
        "consent": payload.consent,
        "contactInfo": contact_info,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _ = await db.captured_leads.insert_one(lead_doc)
    return {"success": True, "id": lead_doc["id"]}


@api_router.post("/track/cta")
async def track_cta(payload: CtaTrackCreate):
    event_doc = {
        "id": str(uuid.uuid4()),
        "sessionId": payload.sessionId,
        "action": payload.action,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _ = await db.cta_events.insert_one(event_doc)
    return {"success": True}

# Include the router in the main app
app.include_router(api_router)

cors_origins = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",") if origin.strip()]
allow_credentials = os.environ.get("CORS_ALLOW_CREDENTIALS", "false").lower() == "true"

if allow_credentials and "*" in cors_origins:
    raise RuntimeError("CORS_ORIGINS cannot include '*' when CORS_ALLOW_CREDENTIALS=true")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=allow_credentials,
    allow_origins=cors_origins,
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
    client.close()