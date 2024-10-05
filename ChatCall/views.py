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
        logger.info(f"Received request: {request.body}")  # Log incoming request
        try:
            data = json.loads(request.body)  # Load JSON data from the request body
            user_message = data.get('message', '')  # Get the 'message' key
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
                logger.info(f"Bot response: {bot_message}")  # Log the bot's response
                return JsonResponse({'response': bot_message})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)