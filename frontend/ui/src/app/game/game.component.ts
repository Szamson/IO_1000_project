import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';
import { Card, nameAssign, PlayingCard, Suit } from '../gameState';
import { JsonPipe } from '@angular/common';
import { OverlaysService } from '../overlays.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService,
    private overlayService : OverlaysService) { }

  ngOnInit(): void {
    this.exampleState.hands["Tom"].forEach(element => {
      this.cards.push({card:element.card, suit:Suit[element.suit]})
    });
  }

  examplePlayer = "Tom";

  exampleState = {
    hands : {"Tom" : [ {card : 9, suit : "spades"}, {card : 10, suit : "hearts"}, {card : 11, suit : "diamonds"}, {card : 12, suit : "clubs"}, {card : Card.Ace, suit : "spades"} ],
    "Ada" : [ {card : 9, suit : "spades"}, {card : 10, suit : "spades"}, {card : 11, suit : "spades"}, {card : 12, suit : "spades"} ],
    "Marian" : [ {card : 9, suit : "spades"}, {card : 10, suit : "spades"}, {card : 11, suit : "spades"}, {card : 12, suit : "spades"} ]}
  }

  cards : PlayingCard[] = [];// = this.exampleState.hands[this.examplePlayer];
  table : PlayingCard[] = [];// = this.exampleState.hands["Marian"];

  drop(event: CdkDragDrop<Number[]> ) : void
  {
    let overlay = this.overlayService.open();

    setTimeout(_ => overlay.close(), 2000);
    if(event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.logger.log(JSON.stringify(event.container.data[event.currentIndex]))
      console.log(event.container.data[event.currentIndex]);
    }
  }

  cardToFilename(card : PlayingCard)
  {
    return "/assets/png/" + nameAssign[card.card] + "_of_" + card.suit.toString().toLowerCase() + ".png";
  }



}
