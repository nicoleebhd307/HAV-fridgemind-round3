from __future__ import annotations
from typing import Literal
from pydantic import BaseModel, Field

class ReceiptItemOut(BaseModel):
    tempId: str
    name: str
    quantity: float | None = None
    unit: str | None = None
    price: float | None = None
    category: str
    confidence: float = 0.0
    predictedExpiryDate: str
    shelfLevel: Literal["EAT_NOW", "USE_SOON", "SAFE"]

class ReceiptParseResponse(BaseModel):
    receiptId: str
    purchaseDate: str
    ocrMode: str
    items: list[ReceiptItemOut]
    warnings: list[str] = Field(default_factory=list)

class ConfirmItemIn(BaseModel):
    tempId: str
    name: str
    category: str | None = None
    quantity: float | None = None
    unit: str | None = None
    price: float | None = None

class ReceiptConfirmRequest(BaseModel):
    purchaseDate: str | None = None
    items: list[ConfirmItemIn]

class InventoryItemOut(BaseModel):
    id: str
    receiptId: str | None = None
    name: str
    category: str
    quantity: float | None = None
    unit: str | None = None
    price: float | None = None
    purchaseDate: str
    predictedExpiryDate: str
    shelfLevel: Literal["EAT_NOW", "USE_SOON", "SAFE"]
    status: Literal["in_fridge", "consumed", "trashed"]
    createdAt: str
    updatedAt: str

class InventoryManualCreate(BaseModel):
    name: str
    category: str | None = None
    quantity: float | None = None
    unit: str | None = None
    price: float | None = None
    purchaseDate: str | None = None

class InventoryUpdate(BaseModel):
    status: Literal["in_fridge", "consumed", "trashed"] | None = None


class TodoBase(BaseModel):
    title: str
    description: str | None = None


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    isDone: bool | None = None


class TodoOut(TodoBase):
    id: str
    isDone: bool
    createdAt: str
    updatedAt: str
