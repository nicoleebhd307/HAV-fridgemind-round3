# from __future__ import annotations

# from beanie import Document
# from pydantic import Field
# from pymongo import IndexModel, ASCENDING
# from datetime import datetime, timezone
# from uuid import uuid4

# def now_iso() -> str:
#     return datetime.now(timezone.utc).isoformat()

# class Users(Document):
#     id: str = Field(default_factory=lambda: str(uuid4()))

#     # pick what you need:
#     email: str | None = None
#     name: str | None = None

#     created_at: str = Field(default_factory=now_iso)
#     updated_at: str = Field(default_factory=now_iso)

#     class Settings:
#         name = "users"
#         indexes = [
#             IndexModel([("email", ASCENDING)], unique=True, name="uniq_users_email"),
#         ]
