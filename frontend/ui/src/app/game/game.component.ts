import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

import { DialogOverlayRef, OverlaysService } from '../overlays.service';
import { GameServerService } from '../game-server.service';
import { LicitationOverlayComponent } from '../licitation-overlay/licitation-overlay.component';
import { MusikExchangeComponent } from '../musik-exchange/musik-exchange.component';
import { Cards, DealtCards, LicitationSubmission, Musik, ReadableState } from '../gameState';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService,
    private overlayService : OverlaysService,
    private serverService : GameServerService) { }

  cardsEnabled : boolean = true;
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

    this.serverService.socketListen<Musik>('showMusik').subscribe(musik =>{
      if(this.readableState.myPlayer.name == musik.player_name)
      {
        this.overlayService.open(MusikExchangeComponent);
      }
      else
      {
        this.showMusik();
      }
    });

    this.serverService.socketListen('startLicitation').subscribe(_ =>{
      let leftPlayer = this.readableState.leftPlayer.name;
      console.log(leftPlayer);
      this.serverService.socketEmit('submitLicitation', JSON.stringify({player: leftPlayer, value : 100}));
    });

    this.serverService.socketListen('enableCardPlay').subscribe(_ =>{
      this.cardsEnabled = true;
    })
  }

  showMusik()
  {

  }

  isPlayerCurrent()
  {
    return this.serverService.gameState.current_player == this.serverService.user.name;
  }

  drop(event: CdkDragDrop<Number[]> ) : void
  {
    if(event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      this.serverService.socketEmit('playedCard', JSON.stringify(event.container.data[event.currentIndex]))

      let element = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.push(element);
    }
  }

}
