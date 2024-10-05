import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from Members.models import Member, MemberLocation, University


# Create your views here.
class SignupView(View):
    def post(self, request: WSGIRequest):
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        print(data.keys())

        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        university = data.get('university_id')  # Expecting university name from frontend
        emergency_contact_phone = data.get('emergency_contact_phone')
        emergency_contact_name = data.get('emergency_contact_name')

        # Manual validation
        if not full_name or not email or not password:
            return JsonResponse({"error": "Username, email, and password are required"}, status=400)

        if len(password) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters long"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already in use"}, status=400)

        try:
            university = University.objects.get(name=university)
            university_id = university.id
        except Exception as e:
            return JsonResponse({"error": "University not found"}, status=404)

        # Create
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        user.save()

        # Create member
        member = Member.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            university_id=university_id,
            emergency_contact_phone=emergency_contact_phone,
            emergency_contact_name=emergency_contact_name
        )
        member.save()

        return JsonResponse({"success": "User created"}, status=201)


class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = data.get('username')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        print(email)

        # Authenticate the user
        user = authenticate(request, username=email, password=password)

        print(user)

        if user is not None:
            # Log the user in
            login(request, user)
            return JsonResponse({"message": "Login successful", "user_id": user.id}, status=200)
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=401)


@login_required
class SetLocationView(View):
    def post(self, request):
        if request.POST:
            data = request.POST
        else:
            data = json.loads(request.body.decode('utf-8'))

        user_id = data.get('user_id')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if not user_id or not latitude or not longitude:
            return JsonResponse({"error": "User ID, latitude, and longitude are required"}, status=400)

        member = Member.objects.filter(user_id=user_id).first()

        if not member:
            return JsonResponse({"error": "User not found"}, status=404)

        member_location = MemberLocation.objects.create(
            member=member,
            latitude=latitude,
            longitude=longitude
        )
        member_location.save()

        return JsonResponse({"success": "Location saved"}, status=201)


class GetMembersAroundUser(View):
    def post(self, request):
        # get latitude and longitude from member last location (Logged in user)
        user = request.user
        member = Member.objects.filter(user_id=user.id).first()
        member_location = MemberLocation.objects.filter(member_id=member.id).order_by('-timestamp').first()

        if not member_location:
            return JsonResponse({"error": "Location not found"}, status=404)

        latitude = member_location.latitude
        longitude = member_location.longitude

        # get all members around the user
        members = MemberLocation.objects.get_members_in_distance(latitude, longitude, 0.01)

        # return members (Hide sensitive information)
        members_data = []
        for member in members:
            members_data.append({
                "full_name": member.member.full_name,
                "latitude": member.latitude,
                "longitude": member.longitude
            })

        return JsonResponse({"members": members_data}, status=200)


class AskHelpNearbyMembers(View):
    def post(self, request):

        user_id = request.POST.get('user_id')

        member = Member.objects.filter(user_id=user_id).first()

        if not member:
            return JsonResponse({"error": "User not found"}, status=404)

        # get latitude and longitude from member last location (Logged in user)
        member_location = MemberLocation.objects.filter(member_id=member.id).order_by('-timestamp').first()

        if not member_location:
            return JsonResponse({"error": "Location not found"}, status=404)

        latitude = member_location.latitude
        longitude = member_location.longitude

        # get all members around the user
        members = MemberLocation.objects.get_members_in_distance(latitude, longitude, 0.01)

        # send message to all members
        for member in members:
            # send message to member
            pass

        return JsonResponse({"success": "Message sent to nearby members"}, status=200)
