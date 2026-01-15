from __future__ import annotations
import sqlite3
from typing import Any
from .core.config import settings

def get_conn() -> sqlite3.Connection:
    settings.DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(settings.DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS receipts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                original_image_path TEXT NOT NULL,
                preprocessed_image_path TEXT NOT NULL,
                image_sha256 TEXT NOT NULL,
                image_dhash TEXT NOT NULL,
                ocr_mode TEXT NOT NULL,
                ocr_text_raw TEXT,
                ocr_json TEXT,
                parsed_json TEXT,
                purchase_date TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS inventory_items (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                fridge_id TEXT NOT NULL,
                receipt_id TEXT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                food_type TEXT,
                quantity REAL,
                unit TEXT,
                price REAL,
                purchase_date TEXT NOT NULL,
                predicted_expiry_date TEXT NOT NULL,
                shelf_level TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(receipt_id) REFERENCES receipts(id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                is_done INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory_items(user_id);
            CREATE INDEX IF NOT EXISTS idx_receipts_user ON receipts(user_id);
            CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(user_id);
            """
        )

def execute(sql: str, params: tuple[Any, ...] = ()) -> None:
    with get_conn() as conn:
        conn.execute(sql, params)
        conn.commit()

def fetchone(sql: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
    with get_conn() as conn:
        cur = conn.execute(sql, params)
        row = cur.fetchone()
        return dict(row) if row else None

def fetchall(sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    with get_conn() as conn:
        cur = conn.execute(sql, params)
        rows = cur.fetchall()
        return [dict(r) for r in rows]

def reset_db() -> None:
    with get_conn() as conn:
        conn.executescript("DELETE FROM inventory_items; DELETE FROM receipts; VACUUM;")
        conn.commit()
