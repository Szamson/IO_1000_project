from django.db import models
import random
import string


# Create your models here.

def generate_code():
    length = 8

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, length))

        if Room.objects.filter(code=code).count() == 0:
            break

    return code


class Room(models.Model):
    code = models.CharField(max_length=12, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True, null=False)
    player_1 = models.CharField(max_length=50, unique=True, null=True)
    player_2 = models.CharField(max_length=50, unique=True, null=True)
    player_3 = models.CharField(max_length=50, unique=True, null=True)


class Player(models.Model):
    code = models.CharField(max_length=12, default="", unique=True, null=True)
    name = models.CharField(max_length=50, unique=True, null=False)


class Game(models.Model):
    code = models.CharField(max_length=12, default="", unique=True, null=True)
    deck = []
    player_1_hand = []
    player_2_hand = []
    player_3_hand = []
    middle = []
    inactive_player = models.CharField(max_length=50, unique=True, null=True)
