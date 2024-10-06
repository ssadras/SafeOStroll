from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .caller import chat_history
from .utils import generate_response, speech_to_text, text_to_speech
import mimetypes
from django.http import HttpResponse


@csrf_exempt  # Allow requests without CSRF token (for testing)
def ai_chat_view(request):
    if request.method == 'POST':
        # Check if the request is form-encoded or JSON
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
                # Call the updated OpenAI function
                bot_message = generate_response(user_message)
                return JsonResponse({'response': bot_message})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'No message provided.'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


@csrf_exempt  # Allow requests without CSRF token (for testing)
def ai_tts(request):
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
                # Call the OpenAI text-to-speech function to generate the audio
                bot_audio = text_to_speech(user_message)

                # Create an HTTP response with the audio content
                response = HttpResponse(bot_audio, content_type='audio/mpeg')
                response['Content-Disposition'] = 'attachment; filename="response.mp3"'
                return response
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'No message provided.'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


@csrf_exempt  # Allow requests without CSRF token (for testing)
def ai_stt(request):
    if request.method == 'POST':
        if 'audio' not in request.FILES:
            return JsonResponse({'error': 'No audio file provided.'}, status=400)

        audio_file = request.FILES['audio']

        # Check for supported audio formats
        if not audio_file.name.endswith(
                ('.flac', '.m4a', '.mp3', '.mp4', '.mpeg', '.mpga', '.oga', '.ogg', '.wav', '.webm')):
            return JsonResponse({'error': 'Unsupported audio format.'}, status=400)

        try:
            audio_bytes = audio_file.read()  # Read the audio file as bytes
            transcript = speech_to_text(audio_bytes)
            return JsonResponse({'transcript': transcript})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


def clear_chat_history(request):
    chat_history.clear()
    return JsonResponse({"message": "Chat history cleared."})
