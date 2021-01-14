export enum Card
{
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace
};

export const nameAssign = {
    0 : "9",
    1 : "10",
    2 : "jack",
    3 : "queen",
    4 : "king",
    5 : "ace"
}

export enum Suit
{
    Spades = <any>"spades",
    Clubs = <any>"clubs",
    Hearts = <any>"hearts",
    Diamonds = <any>"diamonds"
};

export const suitAssign = 
{
    0 : Suit.Spades,
    1 : Suit.Clubs,
    2 : Suit.Diamonds,
    3 : Suit.Hearts
}


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