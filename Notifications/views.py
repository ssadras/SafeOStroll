from django.http import JsonResponse
from django.views import View

from Notifications.models import Notification


# Create your views here.
class GetNewNotifications(View):
    def get(self, request):
        notifications = Notification.objects.filter(member=request.user.member, seen=False).all()

        res = JsonResponse({'notifications': list(notifications.values())})

        # mark as read
        for notification in notifications:
            notification.seen = True
            notification.save()

        return res


class AddNotification(View):
    def post(self, request):
        title = request.POST.get('title')
        content = request.POST.get('content')
        member_id = request.POST.get('member_id')

        Notification.objects.create(title=title, content=content, member_id=member_id)

        return JsonResponse({'status': 'success'})
