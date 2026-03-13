

from pymongo import MongoClient
import os

client = MongoClient(os.environ.get("MONGO_URI"))

db = client["livestock_db"]
users_collection = db["users"]