# myapp/urls.py
from django.urls import path
from .views import ai_chat_view, ai_tts, ai_stt, clear_chat_history

app_name = "ChatCall"

urlpatterns = [
    path('ai_chat/', ai_chat_view, name='ai_chat'),
    path('ai_tts/', ai_tts, name='ai_tts'),
    path('ai_stt/', ai_stt, name='ai_stt'),
    path('clear_history/', clear_chat_history, name='clear_history'),
]
