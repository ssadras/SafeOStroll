from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_response  # Import the generate_response function

@csrf_exempt  # Allow requests without CSRF token (for testing)
def ai_chat_view(request):
    if request.method == 'POST':
        if request.content_type == 'application/x-www-form-urlencoded':
            user_message = request.POST.get('message', '')
        else:
            try:
                data = json.loads(request.body)
                user_message = data.get('message', '')
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if user_message:
            try:
                bot_message = generate_response(user_message)  # Call your OpenAI function
                return JsonResponse({'response': bot_message})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)