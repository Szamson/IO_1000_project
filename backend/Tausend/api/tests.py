from django.test import TestCase
from django.urls import reverse
from .models import Player, Room, Game
import random
import string


def create_player(name, create_code=False):
    """
    Creates Test player with name and random code if needed for a test
    """
    code = ''
    if create_code:
        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=8))
            if Room.objects.filter(code=code).count() == 0:
                break
    Player.objects.create(name=name, code=code)
    return name


class QuestionIndexViewTests(TestCase):
    def test_past_question(self):
        """
        Returns player with code
        """

        player_name = create_player("Filip", True)
        response = self.client.get(reverse('api'))

        self.assertQuerysetEqual(
            response.context['name'],
            ['Filip']
        )
        player = Player.objects.filter(name=player_name)
        player.delete()

