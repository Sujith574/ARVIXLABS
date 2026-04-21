import sqlite3

def check_complaints():
    conn = sqlite3.connect('c:/Users/sujit/ARVIXLABS/backend/arvix_demo.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints")
    rows = cursor.fetchall()
    print(f"Total complaints: {len(rows)}")
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    check_complaints()
