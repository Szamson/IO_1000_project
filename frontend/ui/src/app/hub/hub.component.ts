import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import {Router} from '@angular/router'
import { Server } from '../server';
import { DealtCards, GameState } from '../gameState'
import {GameServerService} from '../game-server.service'

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  constructor( public logger : LoggerService,
    public router : Router,
    public serverService : GameServerService ) { }

  usernames : string[];
  isHost = false;

  ngOnInit(): void 
  {
    if(this.serverService.user != undefined)
    {
      this.usernames = this.genUsernameList();
      if(this.usernames[0] == this.serverService.user.name)
      {
        this.isHost = true;
      }
    }
    else
    {
      this.router.navigate(["pageNotFound"]);
    }

    this.serverService.socketListen<Server>('joinedServer').subscribe(server =>
    {
      this.serverService.server = server;
      this.usernames = this.genUsernameList();
    });

    this.serverService.socketListen<GameState>('gameStarted').subscribe(gameState =>
    {
      this.serverService.gameState = gameState;
      this.router.navigate([`game/${this.serverService.server.code}`])
    });

    this.serverService.socketListen<void>('notEnoughPlayers').subscribe(_ =>
    {
      alert("Not enough players to start game");
    });

    this.serverService.socketListen<Server>('playerDisconnected').subscribe(server =>
    {
      this.serverService.server = server;
      this.usernames = this.genUsernameList();
    });

  }

  addBot() : void
  {
    this.logger.log("added bot");
  }

  startGame() : void
  {
    this.serverService.socketEmit('startGame', this.serverService.server.code);
  }

  private genUsernameList() : string[]
  {

    let server : Server = this.serverService.server;
    console.log(server);
    return [
      server.host,
      server.player_1,
      server.player_2,
      server.player_3
    ];
  }

}
