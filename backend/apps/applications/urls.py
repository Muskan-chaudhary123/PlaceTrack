from django.urls import path
from apps.applications.views import ApplicationListCreateView, ApplicationDetailView, ApplicationStatsView

urlpatterns = [
    path('', ApplicationListCreateView.as_view(), name='application_list_create'),
    path('stats/', ApplicationStatsView.as_view(), name='application_stats'),
    path('<str:pk>/', ApplicationDetailView.as_view(), name='application_detail'),
]
