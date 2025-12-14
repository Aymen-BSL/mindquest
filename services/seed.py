# seed.py
import database

print("Seeding database...")

# Create a user
user = database.create_user(name="Explorer One", email="explorer@mindquest.com")
print(f"Created User: {user['name']}")

# Create a journey
story_steps = [
    "You entered the dark forest.",
    "You found a glowing key.",
    "You unlocked the ancient door."
]
journey = database.create_journey(story_history=story_steps)
print(f"Created Journey ID: {journey['id']}")

print("Done! Database populated.")