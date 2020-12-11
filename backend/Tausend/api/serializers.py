from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Player
        fields = ('id',
                  'code',
                  'name'
                  )


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id',
                  'code',
                  'deck',
                  'player_1_hand',
                  'player_2_hand',
                  'player_3_hand',
                  'middle',
                  'inactive_player'
                  )


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('host')
