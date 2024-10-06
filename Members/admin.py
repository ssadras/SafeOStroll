from django.contrib import admin

from Members.models import Member, University, MemberLocation

# Register your models here.
admin.site.register(Member)
admin.site.register(University)
admin.site.register(MemberLocation)