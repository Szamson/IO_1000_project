export enum Card
{
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14
};

export const nameAssign = {
    9 : "9",
    10 : "10",
    11 : "jack",
    12 : "queen",
    13 : "king",
    14 : "ace"
}

export enum Suit
{
    Spades = <any>"spades",
    Clubs = <any>"clubs",
    Hearts = <any>"hearts",
    Diamonds = <any>"diamonds"
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