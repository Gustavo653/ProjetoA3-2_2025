import os
import jwt
from typing import List
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from odmantic import ObjectId

from database import engine
from models import User, Role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
JWT_SECRET    = os.getenv("JWT_SECRET", "supersecret")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        sub = payload.get("sub")
        if not sub:
            raise
    except:
        raise HTTPException(401, "Invalid token")
    user = await engine.find_one(User, User.id == ObjectId(sub))
    if not user:
        raise HTTPException(401, "User not found")
    return user

def require_role(roles: List[Role]):
    def _checker(u: User = Depends(get_current_user)):
        if u.role not in roles:
            raise HTTPException(403, "Forbidden")
        return u
    return _checker