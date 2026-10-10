# PlaceTrack Backend API Service

This is the backend API service for PlaceTrack, built with Django, Django REST Framework, MongoDB, and JWT Authentication.

---

## Technical Stack
- **Framework**: Django & Django REST Framework (DRF)
- **Primary Database**: MongoDB (using PyMongo client connection pool)
- **Authentication**: JWT (JSON Web Tokens using PyJWT)

---

## Setup & Local Installation

### Prerequisites
- Python 3.8+
- MongoDB instance running locally (default: `mongodb://localhost:27017/`)

### 1. Create Virtual Environment
Navigate to the `backend/` folder and initialize a virtual environment:
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
- **Windows**:
  ```bash
  venv\Scripts\activate
  ```
- **Linux / macOS**:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` and configure your secret variables:
```bash
cp .env.example .env
```

Make sure MongoDB is running on the specified `MONGO_URI`.

### 5. Start Development Server
```bash
python manage.py runserver
```

---

## API Endpoints Reference

### Health Checks
- **`GET /api/health/`** - Checks Django and MongoDB connectivity. No token required.

### Authentication
- **`POST /api/auth/register/`** - Create user profile. Requires `name`, `email`, and `password`. Returns JWT tokens.
- **`POST /api/auth/login/`** - Verify credentials and return access/refresh tokens.
- **`POST /api/auth/refresh/`** - Renew access tokens using a valid refresh token.
- **`GET /api/auth/me/`** - Fetch profile of currently authenticated user. Requires Bearer Token.

### Applications
All endpoints below require JWT Bearer Authentication (`Authorization: Bearer <access_token>`).

- **`GET /api/applications/`** - Retrieve all applications owned by the user. Supports `?limit=N` for recent activity queries.
- **`POST /api/applications/`** - Create a new application. Automatically links the authenticated user.
  - *Request Body*:
    ```json
    {
      "companyName": "Cvent",
      "role": "SDE Intern",
      "location": "Gurgaon, IN",
      "workMode": "Hybrid",
      "status": "Applied",
      "appliedDate": "2026-08-09",
      "jobLink": "https://example.com/job",
      "jobId": "SDE-102",
      "salary": "₹60,000 / month",
      "source": "LinkedIn",
      "referral": "Yes",
      "notes": "Preparations notes..."
    }
    ```
- **`GET /api/applications/<id>/`** - Get detail of a specific application. Returns `404` if not found or not owned.
- **`PATCH /api/applications/<id>/`** - Update fields of an application (e.g. status transition).
- **`DELETE /api/applications/<id>/`** - Delete an application.
- **`GET /api/applications/stats/`** - Fetch aggregated applications metrics.
  - *Response Body*:
    ```json
    {
      "success": true,
      "data": {
        "total": 5,
        "applied": 3,
        "oa": 1,
        "shortlisted": 1,
        "interview": 1,
        "selected": 0,
        "rejected": 0,
        "withdrawn": 0
      }
    }
    ```

