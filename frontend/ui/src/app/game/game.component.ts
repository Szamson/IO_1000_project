import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

import { DialogOverlayRef, OverlaysService } from '../overlays.service';
import { GameServerService } from '../game-server.service';
import { LicitationOverlayComponent } from '../licitation-overlay/licitation-overlay.component';
import { MusikExchangeComponent } from '../musik-exchange/musik-exchange.component';
import { Cards, DealtCards, GameState, LicitationSubmission, Musik, ReadableState } from '../gameState';
import { ShowMusikComponent } from '../show-musik/show-musik.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService,
    private overlayService : OverlaysService,
    private serverService : GameServerService) { }

  gameStarted : boolean = false;
  readableState : ReadableState;
  overlay : DialogOverlayRef;

  spasowaniGracze = {};
  previousLicitation : string;

  ngOnInit(): void {
    this.readableState = this.serverService.getReadableState();

    this.spasowaniGracze[this.readableState.leftPlayer.name] = false;
    this.spasowaniGracze[this.readableState.rightPlayer.name] = false;
    this.spasowaniGracze[this.readableState.myPlayer.name] = false;

    this.serverService.licitationAmount = 0;

    this.serverService.socketListen<string>('enableLicitation').subscribe(input =>{
      let data : LicitationSubmission = new LicitationSubmission;
      JSON.parse(input, (key, value) => data[key]=value);
      console.log(data);
      if(this.previousLicitation == this.serverService.getUsername())
      {
        this.overlay.close();
      }
      if(this.serverService.licitationAmount == data.value)
      {
        this.spasowaniGracze[this.previousLicitation] = true;
      }

      this.serverService.licitationAmount = data.value;
      this.previousLicitation = data.player;

      if(this.serverService.getUsername() == data.player)
      {
        if(this.spasowaniGracze[this.readableState.rightPlayer.name] &&
          this.spasowaniGracze[this.readableState.leftPlayer.name])
        {
          this.serverService.socketEmit('wonLicitation', null); //wygrano
        }
        else
        {
          if(this.spasowaniGracze[this.readableState.leftPlayer.name])
          {
            this.serverService.leftPlayer = this.readableState.rightPlayer.name;
          }
          else
          {
            this.serverService.leftPlayer = this.readableState.leftPlayer.name;
          }
          this.overlay = this.overlayService.open(LicitationOverlayComponent);
        }
      }
    });

    this.serverService.socketListen<Number[]>('showMusik').subscribe(musik =>{
      this.serverService.musik = musik;
      if(musik.length == 3)
      {
        this.overlay = this.overlayService.open(ShowMusikComponent);
      }
      else
      {
        this.overlay = this.overlayService.open(MusikExchangeComponent);
      }

      console.log(musik);
    });

    this.serverService.socketListen<GameState>('acceptMusik').subscribe(state => {
      this.serverService.gameState = state;
      this.gameStarted = true;
      this.readableState = this.serverService.getReadableState();
      this.overlay.close();
    });

    this.serverService.socketListen('startLicitation').subscribe(_ =>{
      let leftPlayer = this.readableState.leftPlayer.name;
      console.log(leftPlayer);
      this.serverService.socketEmit('submitLicitation', JSON.stringify({player: leftPlayer, value : 100}));
    });

    this.serverService.socketListen<GameState>('gameUpdate').subscribe(state => {
      console.log(state);
      this.serverService.gameState = state;
      this.readableState = this.serverService.getReadableState();
    })

  }

  isPlayerCurrent()
  {
    return this.serverService.gameState.current_player == this.serverService.user.name && this.gameStarted;
  }

  drop(event: CdkDragDrop<Number[]> ) : void
  {
    if(event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      let element = event.previousContainer.data[event.previousIndex];
      this.serverService.socketEmit('playedCard', {name : this.readableState.leftPlayer.name, card : element})

      // event.previousContainer.data.splice(event.previousIndex, 1);
      // event.container.data.push(element);
    }
  }

}
