export enum CardFigure
{
    Nine = 9,
    Ten = 10,
    Jopek = 11,
    Queen = 12,
    King = 13,
    Ace = 14
};

export enum CardColor
{
    Czerwo = 0,
    Wino = 1,
    Dzwonki = 2,
    Zoladz = 3
};

export class Card
{
    figure : CardFigure;
    color : CardColor;
};

export class GameState
{
    hands : {string : Card[]};
    table : Card[];
};