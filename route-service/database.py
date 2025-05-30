import os
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://root:example@mongodb:27017/routedb?authSource=admin"
)

client = AsyncIOMotorClient(MONGO_URL)
default_db = client.get_default_database().name
engine = AIOEngine(client, default_db)
