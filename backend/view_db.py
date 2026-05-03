import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect("data/votesmart.db")
cursor = conn.cursor()

# Get all voter registrations
cursor.execute("SELECT id, name, state, district, status FROM voter_registrations")
rows = cursor.fetchall()

if not rows:
    print("No registrations found.")
else:
    # Print a nice formatted table
    print(f"{'ID':<5} | {'Name':<20} | {'State':<15} | {'District':<15} | {'Status'}")
    print("-" * 75)
    for row in rows:
        print(f"{str(row[0]):<5} | {str(row[1]):<20} | {str(row[2]):<15} | {str(row[3]):<15} | {str(row[4])}")

conn.close()
