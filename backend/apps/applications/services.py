import datetime
from bson import ObjectId
from config.database import get_db

def get_user_applications(user_id):
    """
    Retrieves all applications belonging to the user.
    """
    db = get_db()
    if db is None:
        return []
    return list(db.applications.find({"userId": str(user_id)}))

def get_application(user_id, app_id):
    """
    Retrieves a single application by ID, scoped to user.
    """
    db = get_db()
    if db is None:
        return None
    try:
        oid = ObjectId(app_id)
    except Exception:
        return None
    return db.applications.find_one({"_id": oid, "userId": str(user_id)})

def create_application(user_id, data):
    """
    Inserts a new application document into MongoDB.
    """
    db = get_db()
    if db is None:
        return None

    has_ref = data.get('referral') == 'Yes'

    doc = {
        "userId": str(user_id),
        "company": data.get('companyName'),
        "role": data.get('role'),
        "location": data.get('location', ''),
        "workMode": data.get('workMode', 'Not Specified'),
        "status": data.get('status', 'Applied'),
        "appliedDate": data.get('appliedDate'),
        "deadline": data.get('deadline', ''),
        "jobUrl": data.get('jobLink', ''),
        "jobId": data.get('jobId', ''),
        "salary": data.get('salary', ''),
        "source": data.get('source', 'Company Website'),
        "referral": {
            "hasReferral": has_ref,
            "contactId": None,
            "name": None
        },
        "resume": data.get('resume', ''),
        "notes": data.get('notes', ''),
        "recruiter": data.get('recruiter', ''),
        "createdAt": datetime.datetime.utcnow(),
        "updatedAt": datetime.datetime.utcnow()
    }

    result = db.applications.insert_one(doc)
    doc['_id'] = result.inserted_id
    return doc

def update_application(user_id, app_id, data):
    """
    Updates an application document, scoped to owner.
    """
    db = get_db()
    if db is None:
        return None
    try:
        oid = ObjectId(app_id)
    except Exception:
        return None

    # Verify ownership
    existing = db.applications.find_one({"_id": oid, "userId": str(user_id)})
    if not existing:
        return None

    update_fields = {}
    
    
    key_mapping = {
        'companyName': 'company',
        'role': 'role',
        'location': 'location',
        'workMode': 'workMode',
        'status': 'status',
        'appliedDate': 'appliedDate',
        'deadline': 'deadline',
        'jobLink': 'jobUrl',
        'jobId': 'jobId',
        'salary': 'salary',
        'source': 'source',
        'resume': 'resume',
        'notes': 'notes',
        'recruiter': 'recruiter'
    }

    for react_key, mongo_key in key_mapping.items():
        if react_key in data:
            update_fields[mongo_key] = data[react_key]

    if 'referral' in data:
        update_fields['referral'] = {
            "hasReferral": data['referral'] == 'Yes',
            "contactId": None,
            "name": None
        }

    update_fields['updatedAt'] = datetime.datetime.utcnow()

    db.applications.update_one({"_id": oid}, {"$set": update_fields})
    return db.applications.find_one({"_id": oid})

def delete_application(user_id, app_id):
    """
    Deletes an application document, scoped to owner.
    """
    db = get_db()
    if db is None:
        return False
    try:
        oid = ObjectId(app_id)
    except Exception:
        return False

    result = db.applications.delete_one({"_id": oid, "userId": str(user_id)})
    return result.deleted_count > 0

def get_application_stats(user_id):
    """
    Aggregates application status counts for the user.
    """
    db = get_db()
    if db is None:
        return {}

    cursor = db.applications.aggregate([
        {"$match": {"userId": str(user_id)}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ])

    # Preset categories
    stats = {
        "Applied": 0,
        "OA": 0,
        "Interview": 0,
        "Rejected": 0,
        "Selected": 0,
        "Withdrawn": 0
    }

    total = 0
    for doc in cursor:
        status_val = doc.get('_id')
        count_val = doc.get('count', 0)
        total += count_val
        if status_val in stats:
            stats[status_val] = count_val

    return {
        "total": total,
        "applied": stats["Applied"],
        "oa": stats["OA"],
        "shortlisted": stats["OA"], # Alias for shortlisted/OA status
        "interview": stats["Interview"],
        "selected": stats["Selected"],
        "rejected": stats["Rejected"],
        "withdrawn": stats["Withdrawn"]
    }
