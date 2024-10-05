import openai
from django.conf import settings

def generate_response(input_text):
    try:
        openai.api_key = settings.SECRET_AI_KEY

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Calm down the user"},
                {"role": "user", "content": input_text}
            ]
        )
        
        bot_message = response.choices[0].message['content']
        return bot_message
    except Exception as e:
        return str(e)