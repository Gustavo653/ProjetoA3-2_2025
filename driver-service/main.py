import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

from database import init_db
from routers import auth, drivers, trucks
import rabbitmq

app = FastAPI(
    title="Driver Service API",
    version="1.0.0",
    description="Gerencia motoristas e operadores — login, CRUD e pending deliveries.",
    docs_url="/swagger",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["Usuários"])
app.include_router(trucks.router, prefix="/api/trucks", tags=["Caminhões"])

@app.get("/metrics", include_in_schema=False)
async def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)

@app.on_event("startup")
async def on_startup():
    await init_db()
    import asyncio
    asyncio.create_task(rabbitmq.start_delivery_consumer())

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for op in path.values():
            op.setdefault("security", [{"BearerAuth": []}])
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000)