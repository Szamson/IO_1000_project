import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import {ActivatedRoute} from '@angular/router'
import { Server } from '../server';
import {GameServerService} from '../game-server.service'

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  constructor( public logger : LoggerService,
    private route : ActivatedRoute,
    public serverService : GameServerService ) { }

  usernames : string[];

  ngOnInit(): void 
  {
    this.usernames = this.genUsernameList();

    this.serverService.socketListen<Server>('updatePlayers').subscribe(server =>
    {
      this.serverService.server = server;
      this.usernames = this.genUsernameList();
    });

  }

  isHost : boolean = false;

  addBot() : void
  {
    this.logger.log("added bot");
  }

  private genUsernameList() : string[]
  {
    let server : Server = this.serverService.server;
    return [
      server.host,
      server.player1,
      server.player2,
      server.player3
    ];
  }

  genNames(N : number) : string[]
  {
    let tab = new Array<string>(N);
    for(var i = 0; i < this.usernames.length; i++)
    {
      tab[i] = this.usernames[i];
    }
    for(var i = this.usernames.length; i < N; i++)
    {
      tab[i] = "empty";
    }
    return tab;
  }



}
