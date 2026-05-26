from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ShippingLabelCreate(BaseModel):
    carrier: str
    tracking_number: str
    label_url: Optional[str] = None

class ShippingLabelResponse(BaseModel):
    id: str
    order_id: str
    carrier: str
    tracking_number: str
    label_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ShippingQuoteRequest(BaseModel):
    cp_destino: str
    peso_gr: float
    largo_cm: float
    ancho_cm: float
    alto_cm: float

class ShippingQuoteResponse(BaseModel):
    modalidad: str
    precio: float
    dias_estimados: int

class CreateLabelRequest(BaseModel):
    carrier: str = "correo_argentino"
    tracking_number: Optional[str] = None

class TrackingEvent(BaseModel):
    date: str
    description: str

class ShippingTrackingResponse(BaseModel):
    tracking_number: str
    status: str
    carrier: str
    history: list[TrackingEvent]
