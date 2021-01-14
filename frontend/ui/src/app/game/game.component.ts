import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

import { DialogOverlayRef, OverlaysService } from '../overlays.service';
import { GameServerService } from '../game-server.service';
import { LicitationService } from '../licitation.service';

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

  ngOnInit(): void {
    this.exampleState.hands["Tom"].forEach(element => {
      this.cards.push(element)
    });

    this.serverService.socketListen('startLicitation').subscribe(_ =>{
      this.overlay = this.overlayService.open();
    });

    this.serverService.socketListen('acceptLicitation').subscribe(_ =>{
      this.overlay.close();
    })

  }

  overlay : DialogOverlayRef;

  examplePlayer = "Tom";

  exampleState = {
    hands : {"Tom" : [ 0,1,2,3,4,5,6 ],
    "Ada" : [ 7,21,8,2,6,9,2 ],
    "Marian" : [ 5,3,2,6,8,0,5,1 ]}
  }

  cards : Number[] = [];
  table : Number[] = [];

  leftPlayerCards = 7;
  rightPlayerCards = 7;

  arrLen(len : Number)
  {
    return Array(len);
  }

  drop(event: CdkDragDrop<Number[]> ) : void
  {
    if(event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      this.overlay = this.overlayService.open();
      this.licitationService.currentValue.subscribe( val => {
        if(val != 0)
        {
          this.overlay.close();
        }
      })

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.serverService.socketEmit('playedCard', JSON.stringify(event.container.data[event.currentIndex]))
      this.logger.log(JSON.stringify(event.container.data[event.currentIndex]))
      console.log(event.container.data[event.currentIndex]);
    }
  }

}
