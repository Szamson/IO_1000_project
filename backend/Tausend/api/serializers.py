from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.ModelSerializer):
    """
    Class used to serialize Room data
    """

    class Meta:
        model = Room
        fields = ('id',
                  'code',
                  'host',
                  'player_1',
                  'player_2',
                  'player_3',
                  )


class PlayerSerializer(serializers.ModelSerializer):
    """
    Class used to serialize Player data
    """

    class Meta:
        model = Player
        fields = ('id',
                  'code',
                  'name',
                  )


class GameSerializer(serializers.ModelSerializer):
    """
    Class used to serialize Game data
    """

    class Meta:
        model = Game
        fields = ('id',
                  'code',
                  'deck',
                  'player_1_hand',
                  'player_2_hand',
                  'player_3_hand',
                  'middle',
                  'inactive_player',
                  )


class CreateRoomSerializer(serializers.ModelSerializer):
    """
    Class used to decrypt data while creating room a or joining one
    """

    class Meta:
        model = Room
        fields = ('host',
                  'player_1',
                  'player_2',
                  'player_3',
                  )


class CreatePlayerSerializer(serializers.ModelSerializer):
    """
    Class used to decrypt Player data
    """

    class Meta:
        model = Player
        fields = ('name',
                  'code',
                  )


class JoinPlayerSerializer(serializers.ModelSerializer):
    """
    Class used to decrypt Player data while joining to room
    """

    class Meta:
        model = Player
        fields = (
            'code'
        )


class CreateGameSerializer(serializers.ModelSerializer):
    """
    Class used to decrypt Game data
    """

    class Meta:
        model = Game
        fields = ('code',
                  'deck',
                  'player_1_hand',
                  'player_2_hand',
                  'player_3_hand',
                  'middle',
                  'inactive_player',
                  )
