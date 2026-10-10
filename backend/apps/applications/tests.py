from rest_framework.test import APITestCase
from rest_framework import status
from config.database import get_db
from bson import ObjectId

class ApplicationIsolationTests(APITestCase):
    def setUp(self):
        # Get connection
        self.db = get_db()
        if self.db is not None:
            
            self.db.users.delete_many({"email": {"$in": ["usera@example.com", "userb@example.com"]}})
            self.db.applications.delete_many({})

        # 1. Register User A
        res_a = self.client.post('/api/auth/register/', {
            "name": "User A",
            "email": "usera@example.com",
            "password": "password123"
        })
        self.assertEqual(res_a.status_code, status.HTTP_201_CREATED)
        self.user_a_token = res_a.data['data']['access']
        self.user_a_id = res_a.data['data']['user']['id']

        # 2. Register User B
        res_b = self.client.post('/api/auth/register/', {
            "name": "User B",
            "email": "userb@example.com",
            "password": "password123"
        })
        self.assertEqual(res_b.status_code, status.HTTP_201_CREATED)
        self.user_b_token = res_b.data['data']['access']
        self.user_b_id = res_b.data['data']['user']['id']

    def tearDown(self):
        if self.db is not None:
            self.db.users.delete_many({"email": {"$in": ["usera@example.com", "userb@example.com"]}})
            self.db.applications.delete_many({})

    def test_health_check(self):
        """
        Verify GET /api/health/ responds successfully.
        """
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')
        self.assertEqual(response.data['database'], 'connected')

    def test_unauthorized_access(self):
        """
        Verify calling protected endpoints without credentials yields 401.
        """
        response = self.client.get('/api/applications/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_application_creation_and_user_isolation(self):
        """
        Verify creating applications scopes them to the owner, preventing cross-user leakages.
        """
        # User A logs in and creates an application
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_a_token}')
        res_create = self.client.post('/api/applications/', {
            "companyName": "Microsoft",
            "role": "SWE II",
            "status": "Applied",
            "appliedDate": "2026-08-08",
            "location": "Redmond",
            "workMode": "Hybrid",
            "jobLink": "https://careers.microsoft.com",
            "jobId": "MS-994",
            "salary": "$150k",
            "source": "LinkedIn",
            "referral": "Yes",
            "notes": "Referral from alumni"
        })
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)
        app_id = res_create.data['data']['id']
        self.assertEqual(res_create.data['data']['companyName'], "Microsoft")

        # User B logs in and queries applications, should see 0
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_b_token}')
        res_list_b = self.client.get('/api/applications/')
        self.assertEqual(res_list_b.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_list_b.data['data']), 0)

        # User B tries to fetch User A's application detail -> should return 404
        res_get_b = self.client.get(f'/api/applications/{app_id}/')
        self.assertEqual(res_get_b.status_code, status.HTTP_404_NOT_FOUND)

        # User B tries to update User A's application -> should return 404
        res_patch_b = self.client.patch(f'/api/applications/{app_id}/', {"status": "Interview"})
        self.assertEqual(res_patch_b.status_code, status.HTTP_404_NOT_FOUND)

        # User B tries to delete User A's application -> should return 404
        res_delete_b = self.client.delete(f'/api/applications/{app_id}/')
        self.assertEqual(res_delete_b.status_code, status.HTTP_404_NOT_FOUND)

        # User A queries details, update, delete -> should succeed
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_a_token}')
        
        # User A get detail
        res_get_a = self.client.get(f'/api/applications/{app_id}/')
        self.assertEqual(res_get_a.status_code, status.HTTP_200_OK)
        self.assertEqual(res_get_a.data['data']['companyName'], "Microsoft")

        # User A patch status
        res_patch_a = self.client.patch(f'/api/applications/{app_id}/', {"status": "Interview"})
        self.assertEqual(res_patch_a.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch_a.data['data']['status'], "Interview")

        # User A stats checks
        res_stats = self.client.get('/api/applications/stats/')
        self.assertEqual(res_stats.status_code, status.HTTP_200_OK)
        self.assertEqual(res_stats.data['data']['total'], 1)
        self.assertEqual(res_stats.data['data']['interview'], 1)

        # User A delete
        res_delete_a = self.client.delete(f'/api/applications/{app_id}/')
        self.assertEqual(res_delete_a.status_code, status.HTTP_200_OK)
        self.assertTrue(res_delete_a.data['success'])
