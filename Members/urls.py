from django.urls import path

from Members.views import LoginView, SignupView, SetLocationView, GetMembersAroundUser, AskHelpNearbyMembers

app_name = "Members_APP"

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', SignupView.as_view(), name='register'),
    path('set-location/', SetLocationView.as_view(), name='set_location'),
    path('get-members-around-user/', GetMembersAroundUser.as_view(), name='get_members_around_user'),
    #path('ask-help-nearby-members/', AskHelpNearbyMembers.as_view(), name='ask_help_nearby_members'),
]