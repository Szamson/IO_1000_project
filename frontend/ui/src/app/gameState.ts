export enum Card
{
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace
};

export const nameAssign = 
{
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

// as 11, dziesiątka 10, król 4, dama 3, walet 2, dziewiątka 0. 

export const pointAssign = 
{
    0 : 0,
    1 : 10,
    2 : 2,
    3 : 3,
    4 : 4,
    5 : 11
}

export class PlayingCard
{
    card : Card;
    suit : Suit;
};

export class GameState
{
    code : string;
    player_1_hand : Number[];
    player_2_hand : Number[];
    player_3_hand : Number[];
    middle : Number[];

    player_1_points : Number;
    player_2_points : Number;
    player_3_points : Number;
    player_4_points : Number;

    inactive_player : string;
    current_player : string;
};

export class ReadableState
{
    leftPlayer : {name : string, cards: Number[]};
    myPlayer : {name : string, cards: Number[]};
    rightPlayer : {name : string, cards: Number[]};
    table : Number[];
};

export class Cards 
{
    hand : Number[];
    left : Number[];
    right : Number[];
};

export class DealtCards
{
    left_player_name : string;
    right_player_name : string;
    cards : {[name : string] : Number[]};
};

export class Musik 
{
    player_name : string;
    cards : Number[];
};

export class LeaderboardEntry
{
    name : string;
    points : Number;
}

export class LicitationSubmission
{
    player : string;
    value : number;
}