import openai
from django.conf import settings
import io


def generate_response(input_text, previous_chats=None):
    # Generates a response from the OpenAI API

    try:
        openai.api_key = settings.SECRET_AI_KEY

        # Include the history of the conversation in the messages to provide context
        messages = [
            {"role": "system", "content": "Always keep your responses short (less than 30 seconds). You are a calm, "
                                          "protective figure, here to help and reassure the user, who might feel "
                                          "scared or distressed. You must recognize signs of fear or distress and "
                                          "respond with empathy. Your role is to ensure they feel safe, "
                                          "provide helpful guidance, and keep them calm. Mention their emotions when "
                                          "appropriate and use reassuring language. You are not a therapist, you are "
                                          "a friend to call. Also, if needed you can mention that they can call UtSC "
                                          "campus police at (416) 978-2222"},
        ]

        if previous_chats is not None and len(previous_chats) > 0:
            messages.extend(previous_chats)

        # Add the current user input as the next message in the conversation
        messages.append({"role": "user", "content": input_text})

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages
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
            model="tts-1",
            voice="nova"
        )

        audio_content = response.content
        return audio_content
    except Exception as e:
        return str(e)
