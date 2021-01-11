import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';
//import { PlayingCard } from '../gameState';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService) { }

  cards : Number[] = [1, 2, 3];
  table : Number[] = [4];

  // export class GameState
  // {
  //     hands : {string : Card[]};
  //     table : Card[];
  // };

  // export class PlayingCard
  // {
  //     card : Card;
  //     suit : Suit;
  // };

  examplePlayer = "Tom";

  exampleState = {
    hands : {"Tom" : [ {card : 9, suit : "spades"}, {card : 10, suit : "spades"}, {card : 11, suit : "spades"}, {card : 12, suit : "spades"} ],
    "Ada" : [ {card : 9, suit : "spades"}, {card : 10, suit : "spades"}, {card : 11, suit : "spades"}, {card : 12, suit : "spades"} ],
    "Marian" : [ {card : 9, suit : "spades"}, {card : 10, suit : "spades"}, {card : 11, suit : "spades"}, {card : 12, suit : "spades"} ]}
  }

  drop(event: CdkDragDrop<Number[]> ) : void
  {
    this.logger.log("aaa");
    if(event.previousContainer === event.container)
    {
      this.logger.log("bbb");
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      this.logger.log("ccc");
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  cardToFilename()
  {

  }

  ngOnInit(): void {
  }

}
