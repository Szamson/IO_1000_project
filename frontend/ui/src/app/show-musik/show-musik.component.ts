import { Component, OnInit } from '@angular/core';
import { GameServerService } from '../game-server.service';

@Component({
  selector: 'app-show-musik',
  templateUrl: './show-musik.component.html',
  styleUrls: ['./show-musik.component.css']
})
export class ShowMusikComponent implements OnInit {

  constructor(private serverService : GameServerService) { }

  cards : Number[];

  ngOnInit(): void {
    this.cards = this.serverService.musik;
  }

}
