import os
import pymongo
from dotenv import load_dotenv

# Load env variables
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'placetrack')

client = None
db = None

def get_db():
    """
    Exposes the active database connection, initializing on-demand if offline on boot.
    """
    global client, db
    if db is not None:
        return db

    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'placetrack')

    try:
        client = pymongo.MongoClient(
            MONGO_URI,
            maxPoolSize=50,
            minPoolSize=10,
            serverSelectionTimeoutMS=2000
        )
        
        client.admin.command('ping')
        db = client[MONGO_DB_NAME]
        
        
        db.applications.create_index([("userId", pymongo.ASCENDING)])
        db.applications.create_index([("userId", pymongo.ASCENDING), ("status", pymongo.ASCENDING)])
        db.applications.create_index([("userId", pymongo.ASCENDING), ("appliedDate", pymongo.DESCENDING)])
        db.applications.create_index([("userId", pymongo.ASCENDING), ("company", pymongo.ASCENDING)])
        
        db.resources.create_index([("userId", pymongo.ASCENDING)])
        db.resources.create_index([("userId", pymongo.ASCENDING), ("category", pymongo.ASCENDING)])
        db.resources.create_index([("userId", pymongo.ASCENDING), ("type", pymongo.ASCENDING)])
        return db
    except Exception as e:
        print(f"Failed to initialize pymongo client: {e}")
        client = None
        db = None
        return None
