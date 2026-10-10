import datetime
import os
import re
from bson import ObjectId
import gridfs
from config.database import get_db

ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.doc', '.txt', '.pptx', '.ppt'}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

MIME_TYPES = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.txt': 'text/plain',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.ppt': 'application/vnd.ms-powerpoint'
}

VALID_CATEGORIES = [
    'Email Templates',
    'Referral Templates',
    'Recruiter Messages',
    'Resume',
    'CS Fundamentals',
    'Interview Preparation',
    'Project Notes',
    'Study Notes',
    'Useful Links',
    'Personal'
]

VALID_TYPES = [
    'Document',
    'Note',
    'Email Template',
    'Message Template',
    'Link',
    'Checklist'
]

def get_gridfs():
    db = get_db()
    if db is None:
        return None
    return gridfs.GridFS(db)

def sanitize_filename(name):
    # Strip dangerous characters, keep alphanumerics, dots, hyphens, underscores
    clean = re.sub(r'[^a-zA-Z0-9._-]', '_', os.path.basename(name))
    return clean or 'document'

def format_doc(doc):
    if not doc:
        return None
    if '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    if 'createdAt' in doc and isinstance(doc['createdAt'], datetime.datetime):
        doc['createdAt'] = doc['createdAt'].isoformat()
    if 'updatedAt' in doc and isinstance(doc['updatedAt'], datetime.datetime):
        doc['updatedAt'] = doc['updatedAt'].isoformat()
    if 'lastUsedAt' in doc and isinstance(doc['lastUsedAt'], datetime.datetime):
        doc['lastUsedAt'] = doc['lastUsedAt'].isoformat()
    return doc

def validate_uploaded_file(uploaded_file):
    if not uploaded_file:
        return
    filename = uploaded_file.name
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file format '{ext}'. Supported formats: PDF, DOCX, TXT, PPTX.")
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValueError(f"File size exceeds maximum limit of 25MB (size: {round(uploaded_file.size / (1024*1024), 2)}MB).")

def store_file(user_id, uploaded_file):
    validate_uploaded_file(uploaded_file)
    fs = get_gridfs()
    if fs is None:
        raise RuntimeError("Database file storage unavailable.")

    ext = os.path.splitext(uploaded_file.name)[1].lower()
    content_type = MIME_TYPES.get(ext, uploaded_file.content_type or 'application/octet-stream')
    safe_name = sanitize_filename(uploaded_file.name)

    file_bytes = uploaded_file.read()
    file_id = fs.put(
        file_bytes,
        filename=safe_name,
        contentType=content_type,
        userId=str(user_id),
        uploadDate=datetime.datetime.utcnow()
    )

    return {
        'fileId': str(file_id),
        'fileName': safe_name,
        'fileSize': len(file_bytes),
        'contentType': content_type,
        'uploadedAt': datetime.datetime.utcnow().isoformat()
    }

def delete_stored_file(file_id):
    if not file_id:
        return
    fs = get_gridfs()
    if fs is None:
        return
    try:
        oid = ObjectId(file_id)
        fs.delete(oid)
    except Exception:
        pass

def get_user_resources(user_id, category=None, res_type=None, search=None, sort_by=None):
    db = get_db()
    if db is None:
        return []

    query = {"userId": str(user_id)}
    if category and category != 'All':
        query["category"] = category
    if res_type and res_type != 'All':
        query["type"] = res_type

    cursor = db.resources.find(query)
    docs = [format_doc(d) for d in cursor]

    # In-memory search filter if search term provided
    if search and search.strip():
        q = search.strip().lower()
        docs = [
            d for d in docs
            if q in (d.get('title') or '').lower()
            or q in (d.get('description') or '').lower()
            or q in (d.get('category') or '').lower()
            or q in (d.get('content') or '').lower()
            or q in (d.get('emailSubject') or '').lower()
            or (d.get('file') and q in (d['file'].get('fileName') or '').lower())
            or any(q in t.lower() for t in d.get('tags', []))
        ]

    # Sorting
    if sort_by == 'Recently Created':
        docs.sort(key=lambda x: x.get('createdAt') or '', reverse=True)
    elif sort_by == 'Title A-Z':
        docs.sort(key=lambda x: (x.get('title') or '').lower())
    elif sort_by == 'Title Z-A':
        docs.sort(key=lambda x: (x.get('title') or '').lower(), reverse=True)
    elif sort_by == 'Most Used':
        docs.sort(key=lambda x: x.get('usageCount') or 0, reverse=True)
    else:  # Default: Recently Updated
        docs.sort(key=lambda x: x.get('updatedAt') or x.get('createdAt') or '', reverse=True)

    return docs

def get_resource(user_id, resource_id):
    db = get_db()
    if db is None:
        return None
    try:
        oid = ObjectId(resource_id)
    except Exception:
        return None
    doc = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    return format_doc(doc)

def create_resource(user_id, data, uploaded_file=None):
    db = get_db()
    if db is None:
        raise RuntimeError("Database unavailable.")

    title = (data.get('title') or '').strip()
    if not title:
        raise ValueError("Resource title is required.")

    category = data.get('category', 'Personal')
    res_type = data.get('type', 'Note')

    file_metadata = None
    if res_type == 'Document' and uploaded_file:
        file_metadata = store_file(user_id, uploaded_file)

    now = datetime.datetime.utcnow()
    doc = {
        "userId": str(user_id),
        "title": title,
        "category": category,
        "type": res_type,
        "description": (data.get('description') or '').strip(),
        "content": (data.get('content') or '').strip() if res_type in ['Note', 'Email Template', 'Message Template', 'Document'] else '',
        "emailSubject": (data.get('emailSubject') or '').strip() if res_type == 'Email Template' else '',
        "url": (data.get('url') or '').strip() if res_type == 'Link' else '',
        "checklistItems": data.get('checklistItems', []) if res_type == 'Checklist' else [],
        "file": file_metadata,
        "tags": data.get('tags', []),
        "favorite": bool(data.get('favorite', False)),
        "usageCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "lastUsedAt": None
    }

    result = db.resources.insert_one(doc)
    doc['_id'] = result.inserted_id
    return format_doc(doc)

def update_resource(user_id, resource_id, data, uploaded_file=None, remove_file=False):
    db = get_db()
    if db is None:
        raise RuntimeError("Database unavailable.")

    try:
        oid = ObjectId(resource_id)
    except Exception:
        return None

    existing = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    if not existing:
        return None

    updates = {
        "updatedAt": datetime.datetime.utcnow()
    }

    if 'title' in data:
        t = (data['title'] or '').strip()
        if t:
            updates['title'] = t
    if 'category' in data:
        updates['category'] = data['category']
    if 'type' in data:
        updates['type'] = data['type']
    if 'description' in data:
        updates['description'] = (data['description'] or '').strip()
    if 'content' in data:
        updates['content'] = (data['content'] or '').strip()
    if 'emailSubject' in data:
        updates['emailSubject'] = (data['emailSubject'] or '').strip()
    if 'url' in data:
        updates['url'] = (data['url'] or '').strip()
    if 'checklistItems' in data:
        updates['checklistItems'] = data['checklistItems']
    if 'tags' in data:
        updates['tags'] = data['tags']
    if 'favorite' in data:
        updates['favorite'] = bool(data['favorite'])
    if 'usageCount' in data:
        updates['usageCount'] = int(data['usageCount'])
    if 'lastUsedAt' in data:
        updates['lastUsedAt'] = datetime.datetime.utcnow()

    # Handle file replacement or removal
    if uploaded_file:
        # Delete old file from GridFS if existed
        if existing.get('file') and existing['file'].get('fileId'):
            delete_stored_file(existing['file']['fileId'])
        updates['file'] = store_file(user_id, uploaded_file)
    elif remove_file:
        if existing.get('file') and existing['file'].get('fileId'):
            delete_stored_file(existing['file']['fileId'])
        updates['file'] = None

    db.resources.update_one({"_id": oid, "userId": str(user_id)}, {"$set": updates})
    updated = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    return format_doc(updated)

def delete_resource(user_id, resource_id):
    db = get_db()
    if db is None:
        return False

    try:
        oid = ObjectId(resource_id)
    except Exception:
        return False

    existing = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    if not existing:
        return False

    # Delete attached GridFS file if any
    if existing.get('file') and existing['file'].get('fileId'):
        delete_stored_file(existing['file']['fileId'])

    res = db.resources.delete_one({"_id": oid, "userId": str(user_id)})
    return res.deleted_count > 0

def get_resource_file(user_id, resource_id):
    db = get_db()
    if db is None:
        return None, None

    try:
        oid = ObjectId(resource_id)
    except Exception:
        return None, None

    res = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    if not res or not res.get('file') or not res['file'].get('fileId'):
        return None, None

    fs = get_gridfs()
    if fs is None:
        return None, None

    try:
        file_oid = ObjectId(res['file']['fileId'])
        grid_out = fs.get(file_oid)
        return grid_out, res['file']
    except Exception:
        return None, None

def toggle_checklist_item(user_id, resource_id, item_id):
    db = get_db()
    if db is None:
        return None

    try:
        oid = ObjectId(resource_id)
    except Exception:
        return None

    res = db.resources.find_one({"_id": oid, "userId": str(user_id)})
    if not res:
        return None

    items = res.get('checklistItems') or []
    updated_items = []
    found = False
    for item in items:
        if item.get('id') == item_id:
            item['completed'] = not item.get('completed', False)
            found = True
        updated_items.append(item)

    if not found:
        return None

    now = datetime.datetime.utcnow()
    db.resources.update_one(
        {"_id": oid, "userId": str(user_id)},
        {"$set": {"checklistItems": updated_items, "updatedAt": now}}
    )
    res['checklistItems'] = updated_items
    res['updatedAt'] = now
    return format_doc(res)

