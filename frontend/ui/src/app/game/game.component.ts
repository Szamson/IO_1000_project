import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

import { DialogOverlayRef, OverlaysService } from '../overlays.service';
import { GameServerService } from '../game-server.service';
import { LicitationService } from '../licitation.service';
import { LicitationOverlayComponent } from '../licitation-overlay/licitation-overlay.component';
import { MusikExchangeComponent } from '../musik-exchange/musik-exchange.component';
import { DealtCards, Musik } from '../gameState';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService,
    private overlayService : OverlaysService,
    private licitationService : LicitationService,
    private serverService : GameServerService) { }

  cardsEnabled : boolean = true;

  ngOnInit(): void {
    this.updateHands();

    this.serverService.socketListen<number>('enableLicitation').subscribe(value =>{
      this.serverService.licitationAmount = value;
      this.overlay = this.overlayService.open(MusikExchangeComponent);
    });

    this.serverService.socketListen('acceptLicitation').subscribe(_ =>{
      this.overlay.close();
    })

    this.serverService.socketListen<Musik>('showMusik').subscribe(musik =>{
      if(this.examplePlayer == musik.player_name)
      {
        this.overlayService.open(MusikExchangeComponent);
      }
      else
      {
        this.showMusik();
      }
    });

    this.serverService.socketListen<DealtCards>('acceptMusik').subscribe(newCards =>{
      this.serverService.dealtCards = newCards;
      this.updateHands();
    });

    this.serverService.socketListen('enableCardPlay').subscribe(_ =>{
      this.cardsEnabled = true;
    })

    this.serverService.socketListen<DealtCards>('acceptCardPlay').subscribe(newCards =>{
      this.cardsEnabled = false;
      this.serverService.dealtCards = newCards;
      this.updateHands();
    })

    this.serverService

  }

  overlay : DialogOverlayRef;

  examplePlayer = "Tom";

  dealtCards = this.serverService.getDealtCards();

  cards : Number[] = [];
  left : Number[] = [];
  right : Number[] = [];
  table : Number[] = [];

  leftPlayerCards = 7;
  rightPlayerCards = 7;

  showMusik()
  {

  }

  updateHands()
  {
    this.left = this.dealtCards.cards[this.dealtCards.left_player_name];
    this.right = this.dealtCards.cards[this.dealtCards.right_player_name];
    this.cards = this.dealtCards.cards[this.examplePlayer];
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
