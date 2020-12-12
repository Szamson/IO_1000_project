from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Player, Room, Game
from .serializers import *


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class PlayerView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class GameView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class RoomPostView(APIView):
    serializer_class = CreateRoomSerializer
    length = 8

    def generate_unique_code(self):

        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=self.length))
            if Room.objects.filter(code=code).count() == 0:
                break

        return code

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

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
    serializer_class = CreatePlayerSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

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


class PlayerGetView(APIView):
    lookup_url_kwarg = 'name'

    def get(self, request):

        name = request.GET.get(self.lookup_url_kwarg)

        if name is not None:
            player = Player.objects.filter(name=name)
            if len(player) > 0:
                data = RoomSerializer(player[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Player Name...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerPopView(APIView):
    lookup_url_kwarg = 'name'

    def get(self, request):

        name = request.GET.get(self.lookup_url_kwarg)

        if name is not None:
            player = Player.objects.filter(name=name)
            if len(player) > 0:
                player.delete()
                return Response(status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Player Name...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Name parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GamePostView(APIView):
    serializer_class = CreateGameSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data.get('code')
            queryset = Player.objects.filter(code=code)
            if len(queryset) > 0:
                game = queryset[0]
                game.deck = serializer.data.get('deck')
                game.player_1_hand = serializer.data.get('player_1_hand')
                game.player_2_hand = serializer.data.get('player_2_hand')
                game.player_3_hand = serializer.data.get('player_3_hand')
                game.middle = serializer.data.get('middle')
                game.inactive_player = serializer.data.get('inactive_player')
                game.save(update_fields=['deck', 'player_1_hand', 'player_2_hand', 'player_3_hand', 'middle',
                                         'inactive_player'])
            else:
                game = Game(code=code)
                game.save()
                return Response(PlayerSerializer(game).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GameGetView(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request):

        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            games = Game.objects.filter(code=code)
            if len(games) > 0:
                data = RoomSerializer(games[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Game Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GamePopView(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request):

        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            games = Game.objects.filter(code=code)
            if len(games) > 0:
                games[0].delete()
                return Response(status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Game Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
