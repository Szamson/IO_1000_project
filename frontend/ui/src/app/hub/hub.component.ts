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
    private servers : GameServerService ) { }

  server = new Server();

  usernames : string[] = ["jan", "kowal"];

  isHost : boolean = false;

  addBot() : void
  {
    this.logger.log("added bot");
  }

  private genUsernameList() : string[]
  {
    let data : string[] = [
      this.server.player1,
      this.server.player2,
      this.server.player3
    ];
    
    return data;
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

  ngOnInit(): void {
    const id : string = this.route.snapshot.paramMap.get('id');
    this.servers.getServer(id).subscribe(serv => this.server = serv);
    this.usernames = this.genUsernameList();
  }

}
