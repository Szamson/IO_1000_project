import {Server} from './server'
import {User} from './user'
import {DealtCards, GameState} from './gameState'
import { nameAssign, PlayingCard, suitAssign } from './gameState';

import { Socket } from 'ngx-socket-io'

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from 'rxjs'

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  readonly serverURL = 'http://localhost:8000/api';

  user : User;
  server : Server;
  gameState : GameState;

  licitationAmount : number = 100;

  exampleDealtCards : DealtCards = {
    left_player_name : "Ada",
    right_player_name : "Marek",
    cards : {
      "Tom" : [1,2,3,4,5,6,7,8],
      "Ada" : [1,2,3,4,5,6,7,8],
      "Marek" : [1,2,3,4,5,6,7,8]
    }
  }

  dealtCards : DealtCards;

  constructor(private http : HttpClient, 
    public logger : LoggerService, 
    private socket : Socket) { }

  getDealtCards() : DealtCards
  {
    return this.exampleDealtCards;
  }

  socketListen<T>(eventName : string) : Observable<T>
  {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
      subscriber.next(data) }
      )}
    )}

  socketEmit(eventName : string, data : string)
  {
    this.socket.emit(eventName, data);
  }

  httpOptions = {
    headers : new HttpHeaders({'Content-type' : 'application/json'})
  };

  cardToFilename(card : PlayingCard)
  {
    return "/assets/png/" + nameAssign[card.card] + "_of_" + card.suit.toString().toLowerCase() + ".png";
  }

  cardNumberToCard(cardNumber : number) : PlayingCard
  {
    if(cardNumber > 24)
    {
      cardNumber = 23;
    }

    let suit = Math.floor(cardNumber / 6);
    let card = cardNumber % 6;

    return {suit : suitAssign[suit], card : card};
  }

  cardToCardNumber(card : PlayingCard) : Number
  {
    let suit = card.suit;
    let card_num = card.card;
    return suit * 6 + card_num;
  }

}
