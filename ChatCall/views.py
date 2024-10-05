from django.shortcuts import render
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

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
                openai.api_key = settings.SECRET_AI_KEY
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": user_message}]
                )
                bot_message = response['choices'][0]['message']['content']
                return JsonResponse({'response': bot_message})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)