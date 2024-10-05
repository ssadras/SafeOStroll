from channels.generic.websocket import AsyncWebsocketConsumer
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils import generate_response


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
        """Send audio data to OpenAI Whisper for transcription."""
        # Send audio data to Whisper for transcription (STT)
        # openai.api_key = "your-openai-api-key"
        # audio_file = InMemoryUploadedFile(
        #     BytesIO(audio_data), None, 'audio.wav', 'audio/wav', len(audio_data), None
        # )
        #
        # # OpenAI Whisper API call for transcription
        # transcription = openai.Audio.transcribe("whisper-1", audio_file)
        return "Transcript placeholder"

    async def generate_ai_response(self, transcription):
        """Generate a response from your AI based on the transcription."""

        return generate_response(transcription)

    async def text_to_speech(self, text):
        """Convert AI-generated text to speech using Google TTS."""
        # input_text = texttospeech.SynthesisInput(text=text)
        # voice = texttospeech.VoiceSelectionParams(
        #     language_code="en-US",
        #     ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        # )
        # audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        #
        # response = tts_client.synthesize_speech(
        #     input=input_text, voice=voice, audio_config=audio_config
        # )
        return "Audio placeholder"
