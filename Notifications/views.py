import json

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View

from Notifications.models import Notification


# Create your views here.
class GetNewNotifications(View):
    def post(self, request):
        user = request.user
        # check user anonymous
        if user.is_anonymous:
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON"}, status=400)
        
            user_id = data.get('user_id')
            print(user_id)
            user = User.objects.get(id=user_id)

        notifications = Notification.objects.filter(member=user.member, seen=False).all()

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
