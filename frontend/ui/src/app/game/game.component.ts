import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public logger : LoggerService) { }

  cards : string[] = ["as", "król", "jopek lol"];
  table : string[] = ["aaa"];

  drop(event: CdkDragDrop<string[]> ) : void
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

  ngOnInit(): void {
  }

}
