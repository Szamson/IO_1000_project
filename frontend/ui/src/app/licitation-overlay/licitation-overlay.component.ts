import { Component, OnInit } from '@angular/core';
import { GameServerService } from '../game-server.service';

import {Router} from '@angular/router'

@Component({
  selector: 'app-licitation-overlay',
  templateUrl: './licitation-overlay.component.html',
  styleUrls: ['./licitation-overlay.component.css']
})
export class LicitationOverlayComponent implements OnInit {

  constructor(private serverService : GameServerService,
              private router : Router) { }

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
    if(this.serverService.licitationAmount != undefined)
    {
      this.licitationValue = this.serverService.licitationAmount;
      this.number = this.licitationValue;
    }
    else
    {
      this.router.navigate(["pageNotFound"]);
    }
    
  }

}
