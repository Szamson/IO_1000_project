from django.db import models
import random
import string


# Create your models here.


class Room(models.Model):
    """
    Class shows how to store Rooms in database

    1.code: unique room code that allows to join room, is given to host while room creation
    2.host: name of player who created room, has more privileges than other players
    3.player_1: name of player no.1
    4.player_2: name of player no.2
    5.player_3: name of player no.3

    !!player_1 != to host!!
    The game has 2 variants (3 but our app has only 2 implemented :P) for 3 and 4 players
    """
    code = models.CharField(max_length=12, default='', unique=True)
    host = models.CharField(max_length=50, null=False)
    player_1 = models.CharField(max_length=50, null=True)
    player_2 = models.CharField(max_length=50, null=True)
    player_3 = models.CharField(max_length=50, null=True)


class Player(models.Model):
    """
    Class shows how to store Players in database

    1.code: Room code where player belongs, can be null if player does not belong to a room
    2.name: Player name, cannot repeat in database
    """
    code = models.CharField(max_length=12, default="", null=True)
    name = models.CharField(max_length=50, null=False, unique=True)


class Game(models.Model):
    """
    Class shows how to store Games in database

    1.code: shows to with room game is bounded
    2.deck: Current state of deck of cards
    3.player_1_hand: Current state of player cards
    4.player_2_hand: Current state of player cards
    5.player_3_hand: Current state of player cards
    6.middle: Shows what cards are on the "middle"
    7.inactive_player: used while playing with 4 players (read rules to learn more)
    """
    code = models.CharField(max_length=12, default="", unique=True, null=True)
    deck = []
    player_1_hand = []
    player_2_hand = []
    player_3_hand = []
    middle = []
    inactive_player = models.CharField(max_length=50, null=True)
