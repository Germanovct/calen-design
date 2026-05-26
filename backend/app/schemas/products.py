from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class VariantCreate(BaseModel):
    size: Optional[str] = None
    color: Optional[str] = None
    stock: int = Field(default=0, ge=0)

class VariantUpdate(BaseModel):
    size: Optional[str] = None
    color: Optional[str] = None
    stock: Optional[int] = Field(default=None, ge=0)

class VariantResponse(BaseModel):
    id: str
    product_id: str
    size: Optional[str] = None
    color: Optional[str] = None
    stock: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    price: float = Field(..., gt=0)
    images: Optional[List[str]] = []
    active: Optional[bool] = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    images: Optional[List[str]] = None
    active: Optional[bool] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    price: float
    images: List[str] = []
    active: bool
    created_at: datetime
    variants: List[VariantResponse] = []

    class Config:
        from_attributes = True
