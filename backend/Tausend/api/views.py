from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RoomSerializer, PlayerSerializer, GameSerializer, CreateRoomSerializer, CreatePlayerSerializer, \
    CreateGameSerializer, DeleteRoomSerializer
from .models import Player, Room, Game
from .bot import Bot
import random
import string


def validate_player(s):
    """
    Validates data in serializer for player model
    :param s: Serializer needed for validation
    :return: True if validation is succesfull False if it fails
    """
    if not s.is_valid():
        query = Player.objects.filter(name=s.data.get('name'))
        if len(query) > 0:
            return True
        else:
            return False
    else:
        return True


def validate_games(s):
    """
    Validates data in serializer for current games model
    :param s: serializer needed for validation
    :return: True if validation is succesfull False if it fails
    """
    if not s.is_valid():
        query = Game.objects.filter(code=s.data.get('code'))
        if len(query) > 0:
            return True
        else:
            return False
    else:
        return True


def validate_room(s):
    """
    Validates data in serializer for room model
    :param s: serializer needed for validation
    :return: True if validation is succesfull False if it fails
    """
    if not s.is_valid():
        query = Room.objects.filter(code=s.data.get('code'))
        if len(query) > 0:
            return True
        else:
            return False
    else:
        return True


class RoomView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Rooms (mainly used in testing database)
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class PlayerView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Players (mainly used in testing database)
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class GameView(generics.ListAPIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints.
    Returns list of Games (mainly used in testing database)
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
        :return: The code it created
        """

        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=self.length))
            if Room.objects.filter(code=code).count() == 0:
                break

        return code

    def post(self, request):
        """
        Saves Room model into database

        :param request: Data send by a request
        :return: Error message, or filled room data and HTTP status
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
        Adds user to first free room slot of given room code

        :param request: Data send by a request
        :return: Error message, or filled room data and HTTP status
        """

        serializer = self.serializer_class(data=request.data)

        v = validate_player(serializer)
        if v:
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
                    return Response({'Bad Request Full': 'Room is Full...'}, status=status.HTTP_404_NOT_FOUND)

            else:
                return Response({'Bad Request Code': 'Invalid Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomRemovePlayerView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """

    serializer_class = CreatePlayerSerializer

    def post(self, request):
        """
        Removes given player from room

        :param request: Data send by a request
        :return: Error message, or filled room data and HTTP status
        """

        serializer = self.serializer_class(data=request.data)

        v = validate_player(serializer)
        if v:
            code = serializer.data.get('code')
            name = serializer.data.get('name')
            queryset = Room.objects.filter(code=code)

            if len(queryset) > 0:
                room = queryset[0]
                if room.host == name:
                    room.host = room.player_1
                    room.player_1 = room.player_2
                    room.player_2 = room.player_3
                    room.player_3 = None
                    room.save(update_fields=['host'])
                    room.save(update_fields=['player_1'])
                    room.save(update_fields=['player_2'])
                    room.save(update_fields=['player_3'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                elif room.player_1 == name:
                    room.player_1 = room.player_2
                    room.player_2 = room.player_3
                    room.player_3 = None
                    room.save(update_fields=['player_1'])
                    room.save(update_fields=['player_2'])
                    room.save(update_fields=['player_3'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                elif room.player_2 == name:
                    room.player_2 = room.player_3
                    room.player_3 = None
                    room.save(update_fields=['player_2'])
                    room.save(update_fields=['player_3'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                elif room.player_3 == name:
                    room.player_3 = None
                    room.save(update_fields=['player_3'])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {'Bad Request Not Found': 'Given Player In Not In This Room...'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                return Response({'Bad Request Code': 'Invalid Code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomGetView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = DeleteRoomSerializer

    def post(self, request):
        """
        Searches through database of rooms

        :param request: data send by a client
        :return: Error message or player data and HTTP status
        """
        serializer = self.serializer_class(data=request.data)

        v = validate_room(serializer)
        if v:
            code = serializer.data.get('code')
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
    serializer_class = DeleteRoomSerializer

    def post(self, request):
        """
        Deletes Room model from database

        :param request: data send by a client
        :return: Error message or Success message and HTTP status
        """
        serializer = self.serializer_class(data=request.data)

        v = validate_room(serializer)
        if v:
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)

            if len(queryset) > 0:
                room = queryset[0]
                room.delete()
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


class PlayerPopView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreatePlayerSerializer

    def post(self, request):
        """
        Deletes Player model from database

        :param request: data send by a client
        :return: Error message or Success message and HTTP status
        """
        serializer = self.serializer_class(data=request.data)

        v = validate_player(serializer)

        if v:
            name = serializer.data.get('name')
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
                print('run.')
            else:
                game = Game(code=code)
                game.mus = serializer.data.get('mus')
                game.player_1_hand = serializer.data.get('player_1_hand')
                game.player_2_hand = serializer.data.get('player_2_hand')
                game.player_3_hand = serializer.data.get('player_3_hand')
                game.player_1_points = serializer.data.get('player_1_points')
                game.player_2_points = serializer.data.get('player_2_points')
                game.player_3_points = serializer.data.get('player_3_points')
                game.player_4_points = serializer.data.get('player_4_points')
                game.middle = serializer.data.get('middle')
                game.inactive_player = serializer.data.get('inactive_player')
                game.current_player = serializer.data.get('current_player')
                game.save()
                return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GameUpdateView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    serializer_class = CreateGameSerializer

    def post(self, request):
        """
        Changes Game model in database

        :param request: data send by a client
        :return: Error message or saved Game data and HTTP status
        """
        serializer = self.serializer_class(data=request.data)
        v = validate_games(serializer)
        if v:
            code = serializer.data.get('code')
            queryset = Game.objects.filter(code=code)
            if len(queryset) > 0:
                game = queryset[0]
                game.mus = serializer.data.get('mus')
                game.player_1_hand = serializer.data.get('player_1_hand')
                game.player_2_hand = serializer.data.get('player_2_hand')
                game.player_3_hand = serializer.data.get('player_3_hand')
                game.player_1_points = serializer.data.get('player_1_points')
                game.player_2_points = serializer.data.get('player_2_points')
                game.player_3_points = serializer.data.get('player_3_points')
                game.player_4_points = serializer.data.get('player_4_points')
                game.middle = serializer.data.get('middle')
                game.inactive_player = serializer.data.get('inactive_player')
                game.current_player = serializer.data.get('current_player')
                game.save(update_fields=['player_1_hand', 'player_2_hand', 'player_3_hand', 'middle',
                                         'inactive_player', 'player_1_points', 'player_2_points',
                                         'player_3_points', 'player_4_points', 'mus', 'current_player'])
                return Response(GameSerializer(game).data, status=status.HTTP_200_OK)
            else:
                return Response({'Not Found': 'Invalid game code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GameGetView(APIView):
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
        v = validate_games(serializer)
        if v:
            code = serializer.data.get('code')
            queryset = Game.objects.filter(code=code)
            if len(queryset) > 0:
                game = queryset[0]
                return Response(GameSerializer(game).data, status=status.HTTP_200_OK)
            else:
                return Response({'Not Found': 'Invalid game code...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GamePopView(APIView):
    """
    Class inherits after APIView class, which allows to use as_view() method required in creating endpoints
    """
    # TODO Change that to post after
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


class BotDecisionView(APIView):
    # TODO Finish
    bot = Bot()

    def post(self, request):
        return None
