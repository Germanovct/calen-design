from fastapi import APIRouter

router = APIRouter()

@router.get("/quote")
def quote_shipping():
    return {"message": "Shipping quote estimation"}
