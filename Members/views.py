from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from Members.models import Member


# Create your views here.
class SignupView(View):
    def post(self, request):
        data = request.POST or request.json()

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
        data = request.POST or request.json()
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
