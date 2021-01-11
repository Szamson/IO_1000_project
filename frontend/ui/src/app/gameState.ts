export enum Card
{
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14
};

export enum Suit
{
    Spades = "spades",
    Clubs = "clubs",
    Hearts = "hearts",
    Diamonds = "diamonds"
};

export class PlayingCard
{
    card : Card;
    suit : Suit;
};

export class GameState
{
    hands : {string : Card[]};
    table : Card[];
};