import sqlite3

try:
    conn = sqlite3.connect('data/votesmart.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN auth_provider VARCHAR DEFAULT 'local'")
    conn.commit()
    print("Column added successfully")
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()
