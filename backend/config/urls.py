from django.urls import path, include
from apps.users.views import HealthCheckView

urlpatterns = [
    path('api/health/', HealthCheckView.as_view(), name='api_health'),
    path('api/auth/', include('apps.users.urls')),
    path('api/applications/', include('apps.applications.urls')),
    path('api/questions/', include('apps.questions.urls')),
    path('api/resources/', include('apps.resources.urls')),
]
