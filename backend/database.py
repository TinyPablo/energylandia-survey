import sqlite3
import json

DB_PATH = "survey.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            album_number TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            selected_dates TEXT NOT NULL,
            transport TEXT NOT NULL,
            seats TEXT
        )
    """)
    conn.commit()
    conn.close()
    
def upsert_submission(data):
    conn = get_connection()
    conn.execute("""
        INSERT OR REPLACE INTO submissions
        (album_number, full_name, selected_dates, transport, seats)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.albumNumber,
        data.fullName,
        json.dumps(data.selectedDates), 
        data.transport,
        data.seats,
    ))
    conn.commit()
    conn.close()

def album_exists(album_number: str) -> bool:
    conn = get_connection()
    row = conn.execute("SELECT 1 FROM submissions WHERE album_number = ?", (album_number,)).fetchone()
    conn.close()
    return row is not None