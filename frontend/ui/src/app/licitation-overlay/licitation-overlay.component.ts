import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameServerService } from '../game-server.service';
import { LicitationSubmission } from '../gameState';

@Component({
  selector: 'app-licitation-overlay',
  templateUrl: './licitation-overlay.component.html',
  styleUrls: ['./licitation-overlay.component.css']
})
export class LicitationOverlayComponent implements OnInit {

  constructor(private serverService : GameServerService) { }

  number : number;
  licitationValue : number;

  increase()
  {
    this.number += 10;
  }

  decrease()
  {
    if(this.number-10 >= this.licitationValue)
    {
      this.number -= 10;
    }
  }

  send()
  {
    this.serverService.socketEmit('submitLicitation', JSON.stringify(
      {player : this.serverService.leftPlayer,
       value : this.number}));
  }

  ngOnInit(): void {
    this.licitationValue = this.serverService.licitationAmount;
    this.number = this.licitationValue;
  }

}
