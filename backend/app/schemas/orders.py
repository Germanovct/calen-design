from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class OrderItemCreate(BaseModel):
    variant_id: str
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    shipping_address: dict
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    variant_id: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    status: str
    total: float
    shipping_address: dict
    mp_payment_id: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class PaymentPreferenceResponse(BaseModel):
    preference_id: str
    init_point: str
