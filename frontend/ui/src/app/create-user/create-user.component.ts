
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import { UserinfoService } from '../userinfo.service';
import {User} from '../user'
import {Router} from '@angular/router'

import {ServerInfo} from '../serverinfo'
import { GameServerService } from '../game-server.service';
import {Server} from '../server'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {

  constructor(private logger : LoggerService, 
    private userinfo : UserinfoService,
    private gameServer : GameServerService,
    public router : Router) { }

  userdata : ServerInfo = new ServerInfo();

  displayJoin : boolean = false;
  displayCreate : boolean = false;

  users : User[];
  user : User;

  onSubmit() : void
  {

  }

  onJoin() : void
  {
    let data : User = new User();
    data.code = null;
    data.id = null;
    data.name = this.userdata.username;
    this.logger.log(data.name);
    this.userinfo.createUser(data).subscribe( u => this.user = u);

    this.logger.log("Selected join form");
    this.displayJoin = true;
  }

  onCreate() : void
  {
    let data : User = new User();
    data.code = null;
    data.id = null;
    data.name = this.userdata.username;
    this.logger.log(data.name);
    this.userinfo.createUser(data).subscribe( u => {
      this.user = u
      let serv = new Server();
      console.log(this.user)
      this.gameServer.createServer(this.user).subscribe(s => {
        serv = s
        console.log(serv)
        this.router.navigate([`hub/${serv.code}`])
      });
    });
  }

  joinServer() : void
  {
    this.logger.log("Joined!");
  }

  ngOnInit(): void {
    this.userinfo.getUsers().subscribe( users => this.users = users );
  }

}