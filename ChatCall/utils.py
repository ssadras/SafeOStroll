import openai
from django.conf import settings
import io

def generate_response(input_text):
    # Generates a response from the OpenAI API

    try:
        openai.api_key = settings.SECRET_AI_KEY

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Calm down the user"},
                {"role": "user", "content": input_text}
            ]
        )
        
        bot_message = response.choices[0].message.content
        return bot_message
    except Exception as e:
        return str(e)


def speech_to_text(audio_bytes):
    # Converts an audio file to text using the OpenAI Whisper API

    try:
        openai.api_key = settings.SECRET_AI_KEY

        buffer = io.BytesIO(audio_bytes)

        buffer.name = "audio.wav"

        audio_file = openai.audio.transcriptions.create(
            model="whisper-1",
            file=buffer
        )

        transcript = audio_file.text
        return transcript
    except Exception as e:
        return str(e)
    

def text_to_speech(text_input, model="tts-1"):
    # Converts text to speech using the OpenAI TTS API

    try:
        openai.api_key = settings.SECRET_AI_KEY

        response = openai.audio.speech.create(
            input=text_input,
            model="tts-1-hd",
            voice="nova"
        )

        audio_content = response.content
        return audio_content
    except Exception as e:
        return str(e)