from channels.generic.websocket import AsyncWebsocketConsumer
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils import generate_response, speech_to_text, text_to_speech
from django.conf import settings
import openai

chat_history = []


class CallSystem(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            # Receive audio data from WebSocket and process with Whisper STT
            transcription = await self.process_audio(bytes_data)
            ai_response = await self.generate_ai_response(transcription)
            tts_audio = await self.text_to_speech(ai_response)
            await self.send(bytes_data=tts_audio)

    async def process_audio(self, audio_data):
        """Convert audio data to text using OpenAI Whisper API"""
        return speech_to_text(audio_data)

    async def generate_ai_response(self, transcription):
        """Generate a response from your AI based on the transcription."""

        response = generate_response(transcription, chat_history)

        chat_history.append({"role": "user", "content": transcription})
        chat_history.append({"role": "assistant", "content": response})

        return response

    async def text_to_speech(self, text):
        """Convert AI-generated text to speech using Google TTS."""
        return text_to_speech(text)
