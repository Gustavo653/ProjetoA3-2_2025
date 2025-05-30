from fastapi import APIRouter, Depends, HTTPException
from typing import List
from odmantic import ObjectId

from database import engine
from models import User, Role
from schemas import UserIn, UserOut
from dependencies import require_role, get_current_user
import rabbitmq, redis_client
import routers.auth

router = APIRouter()

@router.get("/", response_model=List[UserOut])
async def list_users(_: User = Depends(require_role([Role.operator]))):
    return await engine.find(User)

@router.post("/", response_model=UserOut)
async def create_user(
    user_in: UserIn,
    admin: User = Depends(require_role([Role.operator]))
):
    return await routers.auth.register(user_in, admin)

@router.get("/{id}", response_model=UserOut)
async def get_user(
    id: str,
    _: User = Depends(require_role([Role.operator]))
):
    u = await engine.find_one(User, User.id == ObjectId(id))
    if not u:
        raise HTTPException(404, "Not found")
    return u

@router.put("/{id}", response_model=UserOut)
async def update_user(
    id: str,
    user_in: UserIn,
    _: User = Depends(require_role([Role.operator]))
):
    u = await engine.find_one(User, User.id == ObjectId(id))
    if not u:
        raise HTTPException(404, "Not found")
    data = user_in.dict()
    if data.get("password"):
        data["password"] = routers.auth.pwd.hash(data["password"])
    for k, v in data.items():
        setattr(u, k, v)
    await engine.save(u)
    return u

@router.delete("/{id}", status_code=204)
async def delete_user(
    id: str,
    _: User = Depends(require_role([Role.operator]))
):
    u = await engine.find_one(User, User.id == ObjectId(id))
    if not u:
        raise HTTPException(404, "Not found")
    await engine.delete(u)

@router.get("/{id}/pending-deliveries")
async def pending_deliveries(
    id: str,
    me: User = Depends(get_current_user)
):
    if str(me.id) != id and me.role != Role.operator:
        raise HTTPException(403, "Forbidden")
    return await redis_client.get_pending_deliveries(id)
