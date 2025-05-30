import os, jwt
from typing import List
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")

async def get_token_data(token: str = Depends(oauth2)) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(401, "Invalid token")

def require_roles(roles: List[str]):
    def _checker(d=Depends(get_token_data)):
        if d.get("role") not in roles:
            raise HTTPException(403, "Forbidden")
        return d
    return _checker
