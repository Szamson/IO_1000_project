import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'
import { GameServerService } from '../game-server.service';
import { compileDirectiveFromMetadata } from '@angular/compiler';

@Component({
  selector: 'app-musik-exchange',
  templateUrl: './musik-exchange.component.html',
  styleUrls: ['./musik-exchange.component.css']
})
export class MusikExchangeComponent implements OnInit {

  constructor(public serverService : GameServerService) { }

  ngOnInit(): void {
  }

  leftSlot : Number[] = [];
  rightSlot : Number[] = [];
  handSlot : Number[] = [1,2,3];

  acceptChoice()
  {

  }

  drop(event: CdkDragDrop<Number[]>) : void
  {
    if(event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      if(event.container.id == "hand")
      {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
      else if(event.container.id == "left" && event.previousContainer.id == "right" ||
              event.container.id == "right" && event.previousContainer.id == "left")
      {
        if(event.container.data.length == 0)
        {
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        else
        {
          let element = event.previousContainer.data[0];
          event.previousContainer.data[0] = event.container.data[0];
          event.container.data[0] = element;
        }
      }
      else if(event.previousContainer.id == "hand")
      {
        if(event.container.data.length == 0)
        {
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        else
        {
          let element = event.previousContainer.data[event.previousIndex];
          event.previousContainer.data[event.previousIndex] = event.container.data[0];
          event.container.data[0] = element;
        }
      }
    }
  }

}
