from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView


class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class PlayerView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class GameView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


def get_player_data(request):
    data = Player.objects.all()

    serializer = PlayerSerializer(data, many=True)
    return JsonResponse(serializer.data, safe=False)


def get_room_list(request):
    data = Room.objects.all()

    serializer = RoomSerializer(data, many=True)
    return JsonResponse(serializer.data, safe=False)


class RoomPostView(APIView):
    serializer_post_class = CreateRoomSerializer
    length = 8

    def generate_unique_code(self):

        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=self.length))
            if Room.objects.filter(code=code).count() == 0:
                break

        return code

    def post(self, request):
        serializer = self.serializer_post_class(data=request.data)

        if serializer.is_valid():
            host = serializer.data.get('host')
            queryset = Room.objects.filter(host=host)
            if len(queryset) > 0:
                room = queryset[0]
                room.player_1 = serializer.data.get('player_1')
                room.player_2 = serializer.data.get('player_2')
                room.player_3 = serializer.data.get('player_3')
                room.save(update_fields=['player_1', 'player_2', 'player_3'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                code = self.generate_unique_code()
                room = Room(host=host, code=code)
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomGetView(APIView):
    serializer_get_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request):

        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class RoomPopView(APIView):
    serializer_get_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def delete(self, request):

        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room[0].delete()
                return Response({'Success': 'Room Successfully Deleted...'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerPostView(APIView):
    serializer_post_class = CreatePlayerSerializer

    def post(self, request):
        serializer = self.serializer_post_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get('name')
            queryset = Player.objects.filter(name=name)
            if len(queryset) > 0:
                player = queryset[0]
                player.code = serializer.data.get('code')
                player.save(update_fields=['code'])
                return Response(PlayerSerializer(player).data, status=status.HTTP_200_OK)
            else:
                player = Player(name=name)
                player.save()
                return Response(PlayerSerializer(player).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
