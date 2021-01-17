import {Server} from './server'
import {User} from './user'
import {DealtCards, GameState, LeaderboardEntry, ReadableState} from './gameState'
import { nameAssign, PlayingCard, suitAssign } from './gameState';

import { Socket } from 'ngx-socket-io'

import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs'

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  user : User;
  server : Server;
  gameState : GameState;

  licitationAmount : number = 100;
  leftPlayer : string;

  musik : Number[];

  exampleDealtCards : DealtCards = {
    left_player_name : "Ada",
    right_player_name : "Marek",
    cards : {
      "Tom" : [1,2,3,4,5,6,7,8],
      "Ada" : [1,2,3,4,5,6,7,8],
      "Marek" : [1,2,3,4,5,6,7,8]
    }
  }

  constructor(
    public logger : LoggerService, 
    private socket : Socket) { }

  isDefined()
  {
    return this.gameState != undefined && this.server != undefined && this.user != undefined;
  }

  getUsername() : string
  {
    return this.user.name;
  }

  getReadableState() : ReadableState
  {
    const playerList = this.getPlayerList();
    if(playerList[0] == this.user.name)
    {
      return { leftPlayer : {name : playerList[1], cards : this.gameState.player_2_hand},
                myPlayer : {name : playerList[0], cards : this.gameState.player_1_hand},
                rightPlayer : {name : playerList[2], cards : this.gameState.player_3_hand},
                table : this.gameState.middle};
    }
    else if(playerList[1] == this.user.name)
    {
      return { leftPlayer : {name : playerList[2], cards : this.gameState.player_3_hand},
                myPlayer : {name : playerList[1], cards : this.gameState.player_2_hand},
                rightPlayer : {name : playerList[0], cards : this.gameState.player_1_hand},
                table : this.gameState.middle};
    }
    else if(playerList[2] == this.user.name)
    {
      return { leftPlayer : {name : playerList[0], cards : this.gameState.player_1_hand},
                myPlayer : {name : playerList[2], cards : this.gameState.player_3_hand},
                rightPlayer : {name : playerList[1], cards : this.gameState.player_2_hand},
                table : this.gameState.middle};
    }
  }

  getPlayerList() : string[]
  {
    var list : string[] = [];
    if(this.gameState.inactive_player === undefined)
    {
      list = [this.server.host, this.server.player_1, this.server.player_2]
    }
    else
    {
      if(this.gameState.inactive_player != this.server.host)
      {
        list.push(this.server.host)
      }
      if(this.gameState.inactive_player != this.server.player_1)
      {
        list.push(this.server.player_1)
      }
      if(this.gameState.inactive_player != this.server.player_2)
      {
        list.push(this.server.player_2)
      }
      if(this.gameState.inactive_player != this.server.player_3)
      {
        list.push(this.server.player_3)
      }
    }
    return list;
  }

  socketListen<T>(eventName : string) : Observable<T>
  {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
      subscriber.next(data) }
      )}
    )}

  socketEmit(eventName : string, data : any)
  {
    this.socket.emit(eventName, data);
  }

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

  composePoints() : LeaderboardEntry[]
  {
    let array : LeaderboardEntry[];

    array = [ { name : this.server.host, points : this.gameState.player_1_points },
              { name : this.server.player_1, points : this.gameState.player_2_points },
              { name : this.server.player_2, points : this.gameState.player_3_points } ]
    if(this.gameState.inactive_player != undefined)
    {
      array.push({ name : this.server.player_3, points : this.gameState.player_4_points })
    }
    return array;
  }

}
