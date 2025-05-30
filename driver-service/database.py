import os
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
from passlib.context import CryptContext

from models import User, Role

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://root:example@mongodb:27017/driverdb?authSource=admin"
)

client = AsyncIOMotorClient(MONGO_URL)
default_db = client.get_default_database().name
engine = AIOEngine(client, default_db)

async def init_db():
    """
    Semeia um usuário operador padrão, se ainda não existir.
    """
    default_user = "operador"
    default_pass = "senha"

    existing = await engine.find_one(User, User.registration_number == default_user)
    if not existing:
        hashed = pwd.hash(default_pass)
        op = User(
            name="Operador Padrão",
            registration_number=default_user,
            cpf=None,
            license_number=None,
            phone=None,
            password=hashed,
            role=Role.operator
        )
        await engine.save(op)
        print(f"🔐 Operador padrão criado: {default_user} / {default_pass}")
    else:
        print("🔐 Operador padrão já existe, pulando seed.")