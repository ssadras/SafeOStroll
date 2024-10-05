from django.shortcuts import render

# Create your views here.
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Allow requests without CSRF token (for testing)
def ai_chat_view(request):
    if request.method == 'POST':
        user_message = request.POST.get('message', '')
        if user_message:
            openai.api_key = SECRET_AI_KEY
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}]
            )
            bot_message = response['choices'][0]['message']['content']
            return JsonResponse({'response': bot_message})
        return JsonResponse({'error': 'No message provided.'}, status=400)
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
