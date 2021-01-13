from enum import Enum
from enum import IntEnum
from random import *


class Card(IntEnum):
    """
    Enum to track card values easy
    """
    NINE = 0
    JACK = 2
    QUEEN = 3
    KING = 4
    TEN = 10
    ACE = 11

class Siut(Enum):
    """
    Enum to track card siuts easy
    """
    SPADES = 'spades'
    CLUBS = 'clubs'
    DIAMONDS = 'diamonds'
    HEARTHS = 'hearths'


class PlayingCard:
    """
    Class that contains card information
    """
    def __init__(self, card_value, card_siut):
        self.value = card_value
        self.siut = card_siut


class Bot:
    """
    Class that contains all information required for bot to make decisions threw out a game
    """
    deck = []
    hand = []
    hand_value = 0
    dictionary = {}
    marriages = []
    def __init__(self):
        pass

    def make_dict(self):
        """
        Makes dictionary {card_id:PlayingCard} for the entire deck
        :return:
        """
        count = 0
        for siut in Siut:
            for card in Card:
                current_card = PlayingCard(Card(card),Siut(siut))
                temporary_dict = {count:current_card}
                self.dictionary.update(temporary_dict)
                self.deck.append(count)
                count+=1

    def give_random_hand(self):
        """
        Function just to test count_hand_value
        #TODO remove it after bot is done
        :return:
        """
        for i in range(6):
            self.hand.append(randrange(23))

    def make_marriages(self):
        """
        Creates list of marriages for the bot to remember
        :return:
        """
        for key, value in bot.dictionary.items():
            if value.value == Card.QUEEN and value.siut == Siut.HEARTHS:
                self.marriages.append((key,key+1))
            if value.value == Card.QUEEN and value.siut == Siut.SPADES:
                self.marriages.append((key,key+1))
            if value.value == Card.QUEEN and value.siut == Siut.CLUBS:
                self.marriages.append((key, key + 1))
            if value.value == Card.QUEEN and value.siut == Siut.DIAMONDS:
                self.marriages.append((key, key + 1))

    def count_hand_value(self):
        """
        Counts hand value so thad bot can decide to play or not
        :return:
        """
        value = 0
        for item in self.hand:
            value += self.dictionary[item].value

        for pair in self.marriages:
            if pair[0] in self.hand and pair[1] in self.hand:
                if self.dictionary[pair[0]].siut == Siut.HEARTHS:
                    value+=100
                elif self.dictionary[pair[0]].siut == Siut.DIAMONDS:
                    value+=80
                elif self.dictionary[pair[0]].siut == Siut.CLUBS:
                    value+=60
                elif self.dictionary[pair[0]].siut == Siut.SPADES:
                    value+=40
        self.hand_value = value

    def bidding(self,current_bid):
        """
        Simple bidding function might be changed in the future if needed
        :param current_bid: value of current bid
        :return: Boolean if the bot should play
        """
        if self.hand_value>=current_bid:
            return True
        else:
            return False

if __name__ == '__main__':
    bot = Bot()
    bot.make_dict()
    bot.make_marriages()
    bot.give_random_hand()
    bot.count_hand_value()
    print(bot.hand_value)


