import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameServerService } from '../game-server.service';

@Component({
  selector: 'app-licitation-overlay',
  templateUrl: './licitation-overlay.component.html',
  styleUrls: ['./licitation-overlay.component.css']
})
export class LicitationOverlayComponent implements OnInit {

  constructor(private serverService : GameServerService) { }

  number : number;

  increase()
  {
    this.number += 10;
  }

  decrease()
  {
    if(this.number-10 >= this.serverService.licitationAmount)
    {
      this.number -= 10;
    }
  }

  send()
  {
    this.serverService.socketEmit('submitLicitation', JSON.stringify({value : this.number}))
  }

  ngOnInit(): void {
    this.number = this.serverService.licitationAmount;
  }

}
