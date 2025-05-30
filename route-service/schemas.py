from pydantic import BaseModel, validator
from enum import Enum
from typing import Optional
from odmantic import ObjectId

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
    
    @validator("driver_id", "truck_id", pre=True)
    def objid_to_str(cls, v):
        return str(v)
    
    class Config:
        orm_mode = True
        use_enum_values = True
        json_encoders = {ObjectId: str}
