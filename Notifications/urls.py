from django.urls import path

from Notifications.views import GetNewNotifications

app_name = "Notifications_APP"

urlpatterns = [
    path('get_new/', GetNewNotifications.as_view(), name='get_new'),
]