import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

import { DialogOverlayRef, OverlaysService } from '../overlays.service';
import { GameServerService } from '../game-server.service';
import { LicitationOverlayComponent } from '../licitation-overlay/licitation-overlay.component';
import { MusikExchangeComponent } from '../musik-exchange/musik-exchange.component';
import { Cards, DealtCards, Musik, ReadableState } from '../gameState';

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

  ngOnInit(): void {
    this.readableState = this.serverService.getReadableState();

    this.serverService.socketListen<number>('enableLicitation').subscribe(value =>{
      this.serverService.licitationAmount = value;
      this.overlay = this.overlayService.open(MusikExchangeComponent);
    });

    this.serverService.socketListen('acceptLicitation').subscribe(_ =>{
      this.overlay.close();
    })

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

    // this.serverService.socketListen<DealtCards>('acceptMusik').subscribe(newCards =>{
    //   this.serverService.dealtCards = newCards;
    //   this.updateHands();
    // });

    this.serverService.socketListen('enableCardPlay').subscribe(_ =>{
      this.cardsEnabled = true;
    })

    // this.serverService.socketListen<DealtCards>('acceptCardPlay').subscribe(newCards =>{
    //   this.cardsEnabled = false;
    //   this.serverService.dealtCards = newCards;
    //   this.updateHands();
    // })
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
