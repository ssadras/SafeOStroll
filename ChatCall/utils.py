import openai
from django.conf import settings

def generate_response(input_text):
    try:
        openai.api_key = settings.SECRET_AI_KEY  # Set your OpenAI API key

        # Make a call to the OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4o",  # Specify the correct model (like GPT-4 or GPT-3.5)
            messages=[
                {"role": "user", "content": input_text}
            ]
        )
        
        # Correct way to access the message content
        bot_message = response.choices[0].message['content']
        return bot_message
    except Exception as e:
        return str(e)  # Return the error message in case of an exception