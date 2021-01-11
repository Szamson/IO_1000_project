from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Player, Room, Game
from .serializers import *
from ..websocket.connection import WebSocket


class RoomView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Rooms (mainly used in testing, may not survive until end of the project)
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class PlayerView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Players (mainly used in testing, may not survive until end of the project)
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class GameView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Games (mainly used in testing, may not survive until end of the project)
    """
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class RoomPostView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreateRoomSerializer
    length = 8

    def generate_unique_code(self):
        """
        Generates unique 8 letter code
        :return: The code
        """

        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=self.length))
            if Room.objects.filter(code=code).count() == 0:
                break

        return code

    def post(self, request):
        """
        Saves Room model into database

        :param request: data send by a client
        :return: Error message or filled room data and HTTP status
        """

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if len(queryset) > 0:
                return Response({'Bad Request': 'If U r here its bad, very bad...'}, status=status.HTTP_404_NOT_FOUND)
            else:
                host = serializer.data.get('host')
                code = self.generate_unique_code()
                room = Room(host=host, code=code)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomJoinView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreatePlayerSerializer

    def post(self, request):
        """
        Adds user to first free room slot of given code

        :param request: data send by a client
        :return: Error message or filled room data and HTTP status
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data.get('code')
            name = serializer.data.get('name')
            queryset = Room.objects.filter(code=code)

            if len(queryset) > 0:
                room = queryset[0]
                if room.player_1 is None:
                    room.player_1 = name
                    room.save(update_fields=['player_1'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                elif room.player_2 is None:
                    room.player_2 = name
                    room.save(update_fields=['player_2'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                elif room.player_3 is None:
                    room.player_3 = name
                    room.save(update_fields=['player_3'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                else:
                    return Response({'Bad Request': 'Room is Full...'}, status=status.HTTP_404_NOT_FOUND)

            else:
                return Response({'Bad Request': 'Invalid Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomGetView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'code'

    def get(self, request):
        """
        Searches through database of players

        :param request: data send by a client
        :return: Error message or player data and HTTP status
        """
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class RoomPopView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'code'

    def delete(self, request):
        """
        Deletes Room model from database

        :param request: data send by a client
        :return: Error message or Success message and HTTP status
        """
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room[0].delete()
                return Response({'Success': 'Room Successfully Deleted...'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerPostView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreatePlayerSerializer

    def post(self, request):
        """
        Saves Player model into database

        :param request: data send by a client
        :return: Error message or player data and HTTP status
        """
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
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'name'

    def get(self, request):
        """
        Saves Player model into database

        :param request: data send by a client
        :return: Error message or player data and HTTP status
        """
        name = request.GET.get(self.lookup_url_kwarg)

        if name is not None:
            player = Player.objects.filter(name=name)
            if len(player) > 0:
                data = PlayerSerializer(player[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Player Name...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerPopView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'name'

    def get(self, request):
        """
        Deletes Player model from database

        :param request: data send by a client
        :return: Error message or Success message and HTTP status
        """
        name = request.GET.get(self.lookup_url_kwarg)

        if name is not None:
            player = Player.objects.filter(name=name)
            if len(player) > 0:
                player.delete()
                return Response(status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Player Name...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Name parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GamePostView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreateGameSerializer

    def post(self, request):
        """
        Saves Game model into database

        :param request: data send by a client
        :return: Error message or saved Game data and HTTP status
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data.get('code')
            queryset = Game.objects.filter(code=code)
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
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'code'

    def get(self, request):
        """
        Searches through database of Games

        :param request: data send by a client
        :return: Error message or Game data and HTTP status
        """
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            games = Game.objects.filter(code=code)
            if len(games) > 0:
                data = RoomSerializer(games[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Game Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GamePopView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    lookup_url_kwarg = 'code'

    def get(self, request):
        """
        Deletes Game model from database

        :param request: data send by a client
        :return: Error message or success message and HTTP status
        """
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            games = Game.objects.filter(code=code)
            if len(games) > 0:
                games[0].delete()
                return Response(status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Game Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


async def websocket_view(socket: WebSocket):
    await socket.accept()
    while True:
        message = await socket.receive_text()
        await socket.send_text(message)