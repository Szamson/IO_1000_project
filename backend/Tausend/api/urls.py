from django.urls import path, include
from .views import *


urlpatterns = [
    path('games', GameView.as_view()),
    path('players', PlayerView.as_view()),
    path('rooms', RoomView.as_view()),
]