from pymongo import MongoClient
import os

# Get Mongo URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI environment variable not set")

client = MongoClient(MONGO_URI)

db = client["livestock_db"]
users_collection = db["users"]
