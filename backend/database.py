import sqlite3
from pathlib import Path

# Database backend folder मध्येच तयार होईल
DATABASE_PATH = Path(__file__).resolve().parent / "digit_history.db"


def create_table():
    with sqlite3.connect(DATABASE_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS recognition_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prediction TEXT NOT NULL,
                confidence REAL,
                mode TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_history(prediction, confidence=None, mode="Draw"):
    create_table()

    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.execute("""
            INSERT INTO recognition_history
                (prediction, confidence, mode)
            VALUES (?, ?, ?)
        """, (str(prediction), confidence, mode))

        return cursor.lastrowid


def get_history():
    create_table()

    with sqlite3.connect(DATABASE_PATH) as conn:
        conn.row_factory = sqlite3.Row

        rows = conn.execute("""
            SELECT id, prediction, confidence, mode, created_at
            FROM recognition_history
            ORDER BY id DESC
        """).fetchall()

        return [dict(row) for row in rows]


def clear_history():
    create_table()

    with sqlite3.connect(DATABASE_PATH) as conn:
        conn.execute("DELETE FROM recognition_history")


if __name__ == "__main__":
    create_table()
    print("Database created at:", DATABASE_PATH)