from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
import jwt, os

from database import engine
from models import User, Role
from schemas import LoginIn, LoginOut, UserIn, UserOut
from dependencies import require_role

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")

router = APIRouter()

@router.post("/login", response_model=LoginOut)
async def login(data: LoginIn):
    user = await engine.find_one(
        User,
        {"$or": [
            {"cpf": data.identifier},
            {"registration_number": data.identifier},
            {"name": data.identifier}
        ]}
    )
    if not user or not pwd.verify(data.password, user.password):
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode(
        {"sub": str(user.id), "role": user.role.value},
        JWT_SECRET,
        algorithm="HS256"
    )
    return {"token": token, "role": user.role, "userId": str(user.id)}

@router.post("/register", response_model=UserOut)
async def register(
    user_in: UserIn,
    _: User = Depends(require_role([Role.operator]))
):
    if user_in.role == Role.driver and not user_in.license_number:
        raise HTTPException(400, "License number required for driver")
    checks = []
    if user_in.cpf:
        checks.append({"cpf": user_in.cpf})
    if user_in.registration_number:
        checks.append({"registration_number": user_in.registration_number})
    if user_in.license_number:
        checks.append({"license_number": user_in.license_number})
    if checks:
        if await engine.find_one(User, {"$or": checks}):
            raise HTTPException(409, "User already exists")
    hashed = pwd.hash(user_in.password)
    user = User(**user_in.dict(), password=hashed)
    await engine.save(user)
    return user