import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from Members.models import Member, MemberLocation


# Create your views here.
class SignupView(View):
    def post(self, request:WSGIRequest):
        if request.POST:
            data = request.POST
        else:
            data = json.loads(request.body.decode('utf-8'))

        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        university_id = data.get('university_id')  # Expecting university_id from frontend
        emergency_contact_phone = data.get('emergency_contact_phone')
        emergency_contact_name = data.get('emergency_contact_name')

        # Manual validation
        if not full_name or not email or not password:
            return JsonResponse({"error": "Username, email, and password are required"}, status=400)

        if len(password) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters long"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already in use"}, status=400)

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
        if request.POST:
            data = request.POST
        else:
            data = json.loads(request.body.decode('utf-8'))

        username = data.get('username')
        password = data.get('password')

        # Validate input
        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

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

        # get logged-in user
        user = request.user
        if user.id != member.user_id:
            return JsonResponse({"error": "You are not authorized to perform this action"}, status=403)

        member_location = MemberLocation.objects.create(
            member=member,
            latitude=latitude,
            longitude=longitude
        )
        member_location.save()

        return JsonResponse({"success": "Location saved"}, status=201)
