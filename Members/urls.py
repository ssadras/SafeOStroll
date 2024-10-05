from django.urls import path

from Members.views import LoginView

app_name = "Members_APP"

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', LoginView.as_view(), name='register'),
]