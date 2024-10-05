from django.db import models


# Create your models here.
class Notification(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    member = models.ForeignKey('member.Member', on_delete=models.CASCADE)
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
