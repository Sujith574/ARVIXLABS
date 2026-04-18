import sqlite3
import os

db_path = "arvix_demo.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if remarks column exists
    cursor.execute("PRAGMA table_info(complaints)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "remarks" not in columns:
        print("Adding 'remarks' column to 'complaints' table...")
        cursor.execute("ALTER TABLE complaints ADD COLUMN remarks TEXT")
        conn.commit()
        print("Migration complete.")
    else:
        print("'remarks' column already exists.")
    
    conn.close()
else:
    print(f"Database {db_path} not found.")
