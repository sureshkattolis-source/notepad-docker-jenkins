"""
NoteVault - Python Backend (FastAPI + MySQL)
Run: uvicorn main:app --reload --port 5000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import mysql.connector
import os

app = FastAPI(title="NoteVault API", version="1.0.0")

# ── CORS (allow frontend to call backend) ────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DB Config ─────────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "user":     os.getenv("DB_USER",     "root"),
    "password": os.getenv("DB_PASSWORD"),   # Set in .env file
    "database": os.getenv("DB_NAME",     "notepad_db"),
}

def get_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn

# ── Pydantic Models ───────────────────────────────────────────
class NoteCreate(BaseModel):
    title:    str = "Untitled Note"
    content:  Optional[str] = ""
    category: Optional[str] = "General"
    color:    Optional[str] = "#ffffff"
    is_pinned: Optional[int] = 0

class NoteUpdate(BaseModel):
    title:    Optional[str]
    content:  Optional[str]
    category: Optional[str]
    color:    Optional[str]
    is_pinned: Optional[int]

# ── Routes ────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "NoteVault API is running 🚀"}


@app.get("/notes")
def get_all_notes():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC"
    )
    notes = cursor.fetchall()
    # Convert datetime to string for JSON
    for note in notes:
        if note.get("created_at"):
            note["created_at"] = str(note["created_at"])
        if note.get("updated_at"):
            note["updated_at"] = str(note["updated_at"])
    cursor.close()
    conn.close()
    return {"notes": notes, "total": len(notes)}


@app.get("/notes/{note_id}")
def get_note(note_id: int):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM notes WHERE id = %s", (note_id,))
    note = cursor.fetchone()
    cursor.close()
    conn.close()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note["created_at"] = str(note["created_at"])
    note["updated_at"] = str(note["updated_at"])
    return note


@app.post("/notes", status_code=201)
def create_note(note: NoteCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO notes (title, content, category, color, is_pinned) VALUES (%s, %s, %s, %s, %s)",
        (note.title, note.content, note.category, note.color, note.is_pinned)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"message": "Note created", "id": new_id}


@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteUpdate):
    conn = get_db()
    cursor = conn.cursor()
    # Build dynamic UPDATE
    fields = {k: v for k, v in note.dict().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    set_clause = ", ".join([f"{k} = %s" for k in fields])
    values = list(fields.values()) + [note_id]
    cursor.execute(f"UPDATE notes SET {set_clause} WHERE id = %s", values)
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    if affected == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note updated"}


@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE id = %s", (note_id,))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    if affected == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}


@app.get("/notes/search/{keyword}")
def search_notes(keyword: str):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    like = f"%{keyword}%"
    cursor.execute(
        "SELECT * FROM notes WHERE title LIKE %s OR content LIKE %s ORDER BY updated_at DESC",
        (like, like)
    )
    notes = cursor.fetchall()
    for note in notes:
        note["created_at"] = str(note["created_at"])
        note["updated_at"] = str(note["updated_at"])
    cursor.close()
    conn.close()
    return {"notes": notes, "total": len(notes)}
