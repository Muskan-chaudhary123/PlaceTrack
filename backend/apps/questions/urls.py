from django.urls import path
from apps.questions.views import QuestionListCreateView, QuestionDetailView, QuestionSettingsView

urlpatterns = [
    path('settings/', QuestionSettingsView.as_view(), name='questions_settings'),
    path('', QuestionListCreateView.as_view(), name='questions_list_create'),
    path('<str:pk>/', QuestionDetailView.as_view(), name='questions_detail'),
]
