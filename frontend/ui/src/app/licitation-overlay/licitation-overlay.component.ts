import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameServerService } from '../game-server.service';
import { LicitationService } from '../licitation.service';

@Component({
  selector: 'app-licitation-overlay',
  templateUrl: './licitation-overlay.component.html',
  styleUrls: ['./licitation-overlay.component.css']
})
export class LicitationOverlayComponent implements OnInit {

  constructor(private licitationService : LicitationService,
    private serverService : GameServerService) { }

  number = 100;

  increase()
  {
    this.number += 10;
  }

  decrease()
  {
    this.number -= 10;
  }

  send()
  {
    this.serverService.socketEmit('submitLicitation', JSON.stringify({value : this.number}))
    this.licitationService.changeValue(this.number);
    this.licitationService.changeValue(0);
  }

  ngOnInit(): void {
  }

}
