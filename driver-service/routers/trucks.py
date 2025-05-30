from fastapi import APIRouter, Depends, HTTPException
from typing import List
from odmantic import ObjectId
from starlette.responses import Response

from database import engine
from models import Role, Truck
from schemas import TruckIn, TruckOut
from dependencies import require_role

router = APIRouter()

@router.get("/", response_model=List[TruckOut])
async def list_trucks(_: Role = Depends(require_role([Role.operator]))):
    return await engine.find(Truck)

@router.post("/", response_model=TruckOut)
async def create_truck(
    t: TruckIn,
    _: Role = Depends(require_role([Role.operator]))
):
    truck = Truck(**t.dict())
    await engine.save(truck)
    return truck

@router.get("/{id}", response_model=TruckOut)
async def get_truck(
    id: str,
    _: Role = Depends(require_role([Role.operator]))
):
    truck = await engine.find_one(Truck, Truck.id == ObjectId(id))
    if not truck:
        raise HTTPException(404, "Not found")
    return truck

@router.put("/{id}", response_model=TruckOut)
async def update_truck(
    id: str,
    t: TruckIn,
    _: Role = Depends(require_role([Role.operator]))
):
    truck = await engine.find_one(Truck, Truck.id == ObjectId(id))
    if not truck:
        raise HTTPException(404, "Not found")
    for k, v in t.dict().items():
        setattr(truck, k, v)
    await engine.save(truck)
    return truck

@router.delete("/{id}", status_code=204)
async def delete_truck(
    id: str,
    _: Role = Depends(require_role([Role.operator]))
):
    truck = await engine.find_one(Truck, Truck.id == ObjectId(id))
    if not truck:
        raise HTTPException(404, "Not found")
    await engine.delete(truck)
