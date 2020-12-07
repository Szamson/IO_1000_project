from django.db import models
import string
import random


def generate_code():
    length = 8

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, length))

        if Room.objects.filter(code=code).count() == 0:
            break

    return code


# Create your models here.

class Room(models.Model):
    code = models.CharField(max_length=12, default="", unique=True)
    host = models.CharField(max_length=50, unique=True, null=False)
    player_1 = models.CharField(max_length=50, unique=True, null=True)
    player_2 = models.CharField(max_length=50, unique=True, null=True)
    player_3 = models.CharField(max_length=50, unique=True, null=True)
    number_of_players = models.IntegerField()


class Player(models.Model):
    code = models.CharField(max_length=12, default="", unique=True, null=True)
    name = models.CharField(max_length=50, unique=True, null=False)
