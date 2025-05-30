from pydantic import BaseModel, validator
from enum import Enum
from typing import Optional, List

class Status(str, Enum):
    pending   = "pending"
    en_route  = "en_route"
    delivered = "delivered"

class DeliveryBase(BaseModel):
    driver_id:   str
    truck_id:    str
    origin:      str
    destination: str
    status:      Optional[Status] = Status.pending

class DeliveryIn(DeliveryBase):
    pass

class DeliveryOut(DeliveryBase):
    id: str
    
    @validator("id", pre=True)
    def id_to_str(cls, v):
        return str(v)

    class Config:
        orm_mode = True
