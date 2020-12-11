from django.urls import path, include
from .views import *

urlpatterns = [
    path('games', GameView.as_view()),
    path('players', PlayerView.as_view()),
    path('rooms', RoomView.as_view()),
    path('player_data', get_player_data),
    path('room-create', RoomPostView.as_view()),
    path('room-get', RoomGetView.as_view()),
    path('room-delete', RoomPopView.as_view()),
    path('player-create', PlayerPostView.as_view()),
]
