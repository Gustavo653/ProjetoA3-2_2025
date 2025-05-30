from pydantic import BaseModel, validator
from enum import Enum
from typing import Optional, List

class Role(str, Enum):
    operator = "operator"
    driver   = "driver"

class UserBase(BaseModel):
    name: str
    license_number:   Optional[str] = None
    cpf:              Optional[str] = None
    registration_number: Optional[str] = None
    phone:            Optional[str] = None

class UserIn(UserBase):
    password: str
    role:     Role

class UserOut(UserBase):
    id:   str
    role: Role

    @validator("id", pre=True)
    def id_to_str(cls, v):
        return str(v)

    class Config:
        orm_mode = True

class LoginIn(BaseModel):
    identifier: str
    password:   str

class LoginOut(BaseModel):
    token:  str
    role:   Role
    userId: str

class TruckBase(BaseModel):
    plate:    str
    model:    str
    capacity: Optional[int] = None

class TruckIn(TruckBase):
    pass

class TruckOut(TruckBase):
    id: str

    @validator("id", pre=True)
    def id_to_str(cls, v):
        return str(v)

    class Config:
        orm_mode = True