from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import *
from .serializers import *


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class PlayerView(generics.CreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class GameView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


def get_player_data(request):
    data = Player.objects.all()
    if request.method == 'GET':
        serializer = PlayerSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)
