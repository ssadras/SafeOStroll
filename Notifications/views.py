from django.http import JsonResponse
from django.views import View

from Notifications.models import Notification


# Create your views here.
class GetNewNotifications(View):
    def get(self, request):
        notifications = Notification.objects.filter(member=request.user.member, seen=False)
        return JsonResponse({'notifications': list(notifications.values())})