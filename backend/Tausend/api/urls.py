from django.urls import path, include
from .views import *

urlpatterns = [
    path('games', GameView.as_view()),
    path('players', PlayerView.as_view()),
    path('rooms', RoomView.as_view()),
    path('room-create', RoomPostView.as_view()),
    path('room-get', RoomGetView.as_view()),
    path('room-delete', RoomPopView.as_view()),
    path('player-create', PlayerPostView.as_view()),
    path('player-delete', PlayerPostView.as_view()),
    path('player-get', PlayerPostView.as_view()),
]
