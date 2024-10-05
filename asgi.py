import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from ChatCall.caller import CallSystem

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SafeOStroll.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/call/", CallSystem.as_asgi()),  # WebSocket URL route
        ])
    ),
})
