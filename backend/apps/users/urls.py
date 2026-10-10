from django.urls import path
from apps.users.views import RegisterView, LoginView, TokenRefreshView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', MeView.as_view(), name='auth_me'),
]
