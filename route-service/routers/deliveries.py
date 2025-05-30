from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from odmantic import ObjectId
from database import engine
from models import Delivery, Status
from schemas import DeliveryIn, DeliveryOut
from dependencies import get_token_data, require_roles
import rabbitmq

allowed = {
    Status.pending:  [Status.en_route],
    Status.en_route: [Status.delivered],
    Status.delivered:[]
}

router = APIRouter()

@router.get("/", response_model=List[DeliveryOut])
async def list_deliveries(status: Status = None, _=Depends(get_token_data)):
    filter_ = {}
    if status:
        filter_["status"] = status
    return await engine.find(Delivery, filter_)

@router.get("/next/{driver_id}", response_model=DeliveryOut)
async def next_delivery(driver_id: str, _=Depends(get_token_data)):
    ds = await engine.find(
        Delivery,
        {"driver_id": ObjectId(driver_id), "status": {"$ne": Status.delivered}}
    )
    if ds:
        return ds[0]
    raise HTTPException(404, "No deliveries")

@router.get("/{id}", response_model=DeliveryOut)
async def get_delivery(id: str, _=Depends(get_token_data)):
    d = await engine.find_one(Delivery, Delivery.id == ObjectId(id))
    if not d:
        raise HTTPException(404, "Not found")
    return d

@router.post("/", response_model=DeliveryOut)
async def create_delivery(
    d: DeliveryIn,
    _=Depends(require_roles(["operator"]))
):
    delivery = Delivery(**d.dict())
    await engine.save(delivery)
    rabbitmq.publish_event("delivery.created", delivery)
    return delivery

@router.put("/{id}", response_model=DeliveryOut)
async def update_delivery(
    id: str,
    d: DeliveryIn,
    _=Depends(require_roles(["operator"]))
):
    delivery = await engine.find_one(Delivery, Delivery.id == ObjectId(id))
    if not delivery:
        raise HTTPException(404, "Not found")
    for k,v in d.dict().items():
        setattr(delivery, k, v)
    await engine.save(delivery)
    return delivery

@router.put("/{id}/status", response_model=DeliveryOut)
async def update_status(
    id: str,
    status: Status = Body(..., embed=True),
    _=Depends(get_token_data)
):
    delivery = await engine.find_one(Delivery, Delivery.id == ObjectId(id))
    if not delivery:
        raise HTTPException(404, "Not found")
    if status not in allowed[delivery.status]:
        raise HTTPException(400, "Invalid transition")
    delivery.status = status
    await engine.save(delivery)
    rabbitmq.publish_event("delivery.statusUpdated", delivery)
    return delivery

@router.delete("/{id}", status_code=204)
async def delete_delivery(
    id: str,
    _=Depends(require_roles(["operator"]))
):
    d = await engine.find_one(Delivery, Delivery.id == ObjectId(id))
    if not d:
        raise HTTPException(404, "Not found")
    await engine.delete(d)
