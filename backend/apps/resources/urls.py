from django.urls import path
from apps.resources.views import (
    ResourceListCreateView,
    ResourceDetailView,
    ResourceFileView,
    ResourceChecklistToggleView
)

urlpatterns = [
    path('', ResourceListCreateView.as_view(), name='resource_list_create'),
    path('<str:pk>/', ResourceDetailView.as_view(), name='resource_detail'),
    path('<str:pk>/file/', ResourceFileView.as_view(), name='resource_file'),
    path('<str:pk>/checklist/<str:item_id>/', ResourceChecklistToggleView.as_view(), name='resource_checklist_toggle'),
]

