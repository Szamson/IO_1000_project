from django.urls import path
from .views import GameView, PlayerView, RoomView, RoomPostView, RoomGetView, RoomPopView, PlayerPostView, PlayerPopView,\
    GamePopView, GamePostView, RoomJoinView, RoomRemovePlayerView ,GameGetView, GameUpdateView


websocket = path

"""
File used to communicate with frontend.
"""

urlpatterns = [
    path('games', GameView.as_view()),
    path('players', PlayerView.as_view()),
    path('rooms', RoomView.as_view()),
    path('room-create', RoomPostView.as_view()),
    path('room-get', RoomGetView.as_view()),
    path('room-delete', RoomPopView.as_view()),
    path('player-create', PlayerPostView.as_view()),
    path('player-delete', PlayerPopView.as_view()),
    path('game-delete', GamePopView.as_view()),
    path('game-create', GamePostView.as_view()),
    path('room-join', RoomJoinView.as_view()),
    path('remove-player', RoomRemovePlayerView.as_view()),
    path('game-get', GameGetView.as_view()),
    path('game-update', GameUpdateView.as_view())
]
