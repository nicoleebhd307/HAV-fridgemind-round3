from __future__ import annotations

from typing import Any, Iterable
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING
from bson import ObjectId

from .core.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

# --- connection lifecycle ---

async def connect() -> None:
    """Create Mongo client + db handle (call on FastAPI startup)."""
    global _client, _db
    if _client is not None:
        return

    if not settings.MONGODB_URL:
        raise RuntimeError("MONGODB_URL is not set in .env")

    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    _db = _client[settings.MONGODB_DB]

    # fail fast
    await _client.admin.command("ping")


async def close() -> None:
    """Close Mongo client (call on FastAPI shutdown)."""
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase:
    """Get db handle after connect()."""
    if _db is None:
        raise RuntimeError("MongoDB not initialized. Did you call connect() on startup?")
    return _db


# --- init (collections + indexes) ---

async def init_db() -> None:
    """
    Mongo doesn't need tables. We create indexes to match SQLite indexes.
    Call this once on startup after connect().
    """
    db = get_db()

    # receipts indexes
    await db["receipts"].create_index([("user_id", ASCENDING)])
    await db["receipts"].create_index([("created_at", ASCENDING)])

    # inventory_items indexes
    await db["inventory_items"].create_index([("user_id", ASCENDING)])
    await db["inventory_items"].create_index([("fridge_id", ASCENDING)])
    await db["inventory_items"].create_index([("receipt_id", ASCENDING)])

    # todos indexes
    await db["todos"].create_index([("user_id", ASCENDING)])
    await db["todos"].create_index([("created_at", ASCENDING)])


# --- helpers: id conversion ---

def oid(s: str) -> ObjectId:
    """Convert string to ObjectId (raises if invalid)."""
    return ObjectId(s)

def to_public(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    """Convert Mongo _id to string id for API outputs."""
    if not doc:
        return None
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc

def to_public_many(docs: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    return [to_public(d) for d in docs if d is not None]


# --- CRUD helpers (similar vibe to sqlite db.py) ---

async def insert_one(collection: str, doc: dict[str, Any]) -> str:
    db = get_db()
    res = await db[collection].insert_one(doc)
    return str(res.inserted_id)

async def find_one(collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
    db = get_db()
    doc = await db[collection].find_one(query)
    return to_public(doc)

async def find_by_id(collection: str, id: str) -> dict[str, Any] | None:
    db = get_db()
    doc = await db[collection].find_one({"_id": oid(id)})
    return to_public(doc)

async def find_many(
    collection: str,
    query: dict[str, Any],
    limit: int = 200,
    sort: list[tuple[str, int]] | None = None,
) -> list[dict[str, Any]]:
    db = get_db()
    cursor = db[collection].find(query)
    if sort:
        cursor = cursor.sort(sort)
    docs = await cursor.to_list(length=limit)
    return to_public_many(docs)

async def update_one(
    collection: str,
    query: dict[str, Any],
    set_fields: dict[str, Any],
) -> bool:
    db = get_db()
    res = await db[collection].update_one(query, {"$set": set_fields})
    return res.matched_count > 0

async def update_by_id(
    collection: str,
    id: str,
    set_fields: dict[str, Any],
) -> bool:
    return await update_one(collection, {"_id": oid(id)}, set_fields)

async def delete_one(collection: str, query: dict[str, Any]) -> bool:
    db = get_db()
    res = await db[collection].delete_one(query)
    return res.deleted_count > 0

async def delete_by_id(collection: str, id: str) -> bool:
    return await delete_one(collection, {"_id": oid(id)})

async def reset_db() -> None:
    """Dev helper similar to sqlite reset_db()."""
    db = get_db()
    await db["inventory_items"].delete_many({})
    await db["receipts"].delete_many({})
    await db["todos"].delete_many({})
