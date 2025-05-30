from odmantic import Model
from enum import Enum
from typing import Optional
from odmantic.bson import ObjectId

class Status(str, Enum):
    pending  = "pending"
    en_route = "en_route"
    delivered= "delivered"

class Delivery(Model):
    driver_id:     ObjectId
    truck_id:      ObjectId
    origin:        str
    destination:   str
    status:        Status = Status.pending