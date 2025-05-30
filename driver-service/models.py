from enum import Enum
from typing import Optional
from odmantic import Model

class Role(str, Enum):
    operator = "operator"
    driver   = "driver"

class User(Model):
    name: str
    license_number:   Optional[str] = None
    cpf:              Optional[str] = None
    registration_number: Optional[str] = None
    phone:            Optional[str] = None
    password:         str
    role:             Role

class Truck(Model):
    """
    Veículo usado nas entregas.
    """
    plate:    str
    model:    str
    capacity: Optional[int] = None