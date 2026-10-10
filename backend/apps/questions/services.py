import datetime
from bson import ObjectId
from config.database import get_db

def get_questions_settings(user_id):
    """
    Retrieves the user's custom subjects, topics, and custom columns from MongoDB.
    Initializes default configs if none exist.
    """
    db = get_db()
    if db is None:
        return {}
    
    config = db.question_bank_settings.find_one({"userId": str(user_id)})
    if not config:
        # Initialize defaults
        default_config = {
            "userId": str(user_id),
            "subjects": ["DSA", "DBMS", "CN", "OS", "OOPS"],
            "topics": {
                "DSA": ["Arrays", "Trees", "Graphs", "DP"],
                "DBMS": ["Normalization", "SQL Querying", "Transactions"],
                "CN": ["IP Addressing", "TCP/IP Layers", "Routing Protocols"],
                "OS": ["CPU Scheduling", "Process Synchronization", "Virtual Memory"],
                "OOPS": ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"]
            },
            "customColumns": []
        }
        db.question_bank_settings.insert_one(default_config)
        config = default_config

    # Format ObjectId to string if needed
    if "_id" in config:
        config["id"] = str(config["_id"])
        del config["_id"]
    return config

def update_questions_settings(user_id, data):
    """
    Saves the user's subjects, topics, and custom columns to MongoDB.
    """
    db = get_db()
    if db is None:
        return None

    update_fields = {}
    if "subjects" in data:
        update_fields["subjects"] = data["subjects"]
    if "topics" in data:
        update_fields["topics"] = data["topics"]
    if "customColumns" in data:
        update_fields["customColumns"] = data["customColumns"]

    db.question_bank_settings.update_one(
        {"userId": str(user_id)},
        {"$set": update_fields},
        upsert=True
    )
    return get_questions_settings(user_id)

def get_user_questions(user_id):
    """
    Retrieves all questions for a specific user from MongoDB.
    """
    db = get_db()
    if db is None:
        return []
    questions = list(db.questions.find({"userId": str(user_id)}))
    # Map ObjectId to string
    for q in questions:
        q["id"] = str(q["_id"])
        del q["_id"]
    return questions

def get_question(user_id, q_id):
    """
    Retrieves a single question document, scoped to owner.
    """
    db = get_db()
    if db is None:
        return None
    try:
        oid = ObjectId(q_id)
    except Exception:
        return None
    q = db.questions.find_one({"_id": oid, "userId": str(user_id)})
    if q:
        q["id"] = str(q["_id"])
        del q["_id"]
    return q

def create_question(user_id, data):
    """
    Creates a new question document in MongoDB.
    """
    db = get_db()
    if db is None:
        return None

    doc = {
        "userId": str(user_id),
        "subject": data.get("subject", "DSA"),
        "topic": data.get("topic", "Arrays"),
        "question": data.get("question", ""),
        "difficulty": data.get("difficulty", "Medium"),
        "revision": data.get("revision", False),
        "revisit": data.get("revisit", False),
        "customValues": data.get("customValues", {}),
        "createdAt": datetime.datetime.utcnow().isoformat(),
        "updatedAt": datetime.datetime.utcnow().isoformat()
    }

    result = db.questions.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    del doc["_id"]
    return doc

def update_question(user_id, q_id, data):
    """
    Updates a question document in MongoDB, scoped to owner.
    """
    db = get_db()
    if db is None:
        return None
    try:
        oid = ObjectId(q_id)
    except Exception:
        return None

    # Verify ownership
    existing = db.questions.find_one({"_id": oid, "userId": str(user_id)})
    if not existing:
        return None

    update_fields = {}
    key_mapping = ["subject", "topic", "question", "difficulty", "revision", "revisit", "customValues"]
    for key in key_mapping:
        if key in data:
            update_fields[key] = data[key]

    update_fields["updatedAt"] = datetime.datetime.utcnow().isoformat()

    db.questions.update_one({"_id": oid}, {"$set": update_fields})
    return get_question(user_id, q_id)

def delete_question(user_id, q_id):
    """
    Deletes a question document from MongoDB, scoped to owner.
    """
    db = get_db()
    if db is None:
        return False
    try:
        oid = ObjectId(q_id)
    except Exception:
        return False

    result = db.questions.delete_one({"_id": oid, "userId": str(user_id)})
    return result.deleted_count > 0
