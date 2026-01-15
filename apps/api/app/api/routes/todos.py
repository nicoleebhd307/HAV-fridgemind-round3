from __future__ import annotations
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from ...core.config import settings
from ...db import execute, fetchall, fetchone
from ..schemas import TodoCreate, TodoUpdate, TodoOut

router = APIRouter(prefix="/todos")


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


@router.get("/", response_model=list[TodoOut])
def list_todos() -> list[TodoOut]:
    rows = fetchall(
        "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
        (settings.DEMO_USER_ID,),
    )
    return [
        TodoOut(
            id=r["id"],
            title=r["title"],
            description=r.get("description"),
            isDone=bool(r["is_done"]),
            createdAt=r["created_at"],
            updatedAt=r["updated_at"],
        )
        for r in rows
    ]


@router.post("/", response_model=TodoOut)
def create_todo(payload: TodoCreate) -> TodoOut:
    todo_id = f"t_{uuid4().hex}"
    now = _now_iso()
    execute(
        "INSERT INTO todos (id,user_id,title,description,is_done,created_at,updated_at) VALUES (?,?,?,?,?,?,?)",
        (
            todo_id,
            settings.DEMO_USER_ID,
            payload.title,
            payload.description,
            0,
            now,
            now,
        ),
    )
    return TodoOut(
        id=todo_id,
        title=payload.title,
        description=payload.description,
        isDone=False,
        createdAt=now,
        updatedAt=now,
    )


@router.get("/{todo_id}", response_model=TodoOut)
def get_todo(todo_id: str) -> TodoOut:
    row = fetchone(
        "SELECT * FROM todos WHERE id = ? AND user_id = ?",
        (todo_id, settings.DEMO_USER_ID),
    )
    if not row:
        raise HTTPException(status_code=404, detail="Todo not found")
    return TodoOut(
        id=row["id"],
        title=row["title"],
        description=row.get("description"),
        isDone=bool(row["is_done"]),
        createdAt=row["created_at"],
        updatedAt=row["updated_at"],
    )


@router.patch("/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: str, payload: TodoUpdate) -> TodoOut:
    row = fetchone(
        "SELECT * FROM todos WHERE id = ? AND user_id = ?",
        (todo_id, settings.DEMO_USER_ID),
    )
    if not row:
        raise HTTPException(status_code=404, detail="Todo not found")

    title = payload.title if payload.title is not None else row["title"]
    description = (
        payload.description
        if payload.description is not None
        else row.get("description")
    )
    is_done = (
        int(payload.isDone)
        if payload.isDone is not None
        else int(row["is_done"])
    )
    now = _now_iso()

    execute(
        "UPDATE todos SET title = ?, description = ?, is_done = ?, updated_at = ? WHERE id = ? AND user_id = ?",
        (title, description, is_done, now, todo_id, settings.DEMO_USER_ID),
    )

    return TodoOut(
        id=todo_id,
        title=title,
        description=description,
        isDone=bool(is_done),
        createdAt=row["created_at"],
        updatedAt=now,
    )


@router.delete("/{todo_id}")
def delete_todo(todo_id: str) -> dict[str, bool]:
    row = fetchone(
        "SELECT * FROM todos WHERE id = ? AND user_id = ?",
        (todo_id, settings.DEMO_USER_ID),
    )
    if not row:
        raise HTTPException(status_code=404, detail="Todo not found")

    execute(
        "DELETE FROM todos WHERE id = ? AND user_id = ?",
        (todo_id, settings.DEMO_USER_ID),
    )
    return {"ok": True}

