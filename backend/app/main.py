from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, orders, auth, shipping

app = FastAPI(
    title="Calen Design API",
    description="Backend API for Calen Design E-commerce store",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://calen-design.netlify.app", # URL del frontend en Netlify (a ajustar cuando se asocie el dominio)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(shipping.router, prefix="/api/shipping", tags=["Shipping"])

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Calen Design API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
