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
