from django.db import models
from django.contrib.auth.models import User


# Create your models here.
# Model that extends django user for new stuff
class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # profile_pic = models.ImageField(upload_to='profile_pics', blank=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True)
    university = models.ForeignKey('University', on_delete=models.CASCADE, null=True, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name


class University(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    emergency_phone = models.CharField(max_length=15)

    def __str__(self):
        return self.name


# Live location data of user
class MemberLocation(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member.full_name} - {self.latitude}, {self.longitude}"
