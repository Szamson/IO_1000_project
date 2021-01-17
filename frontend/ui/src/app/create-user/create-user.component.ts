
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import {User} from '../user'
import {Server} from '../server'
import {Router} from '@angular/router'

import { GameServerService } from '../game-server.service';
import {FormData} from '../form-data'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {

  constructor(private logger : LoggerService, 
    public serverService : GameServerService,
    public router : Router) { }

  formdata : FormData = new FormData();

  enterUsername : boolean = true;
  displayJoin : boolean = false;
  chooseOption : boolean = false;
  exists : boolean = false;

  ngOnInit() : void
  {
    this.serverService.socketListen<User>('userCreated').subscribe(user => 
    {
      this.serverService.user = user;
      this.enterUsername = false;
      this.chooseOption = true;
    });

    this.serverService.socketListen('usernameTaken').subscribe(_ =>
    {
      alert("Użytkownik o tej nazwie już istnieje")
    })

    this.serverService.socketListen('roomIsFull').subscribe(_ =>
    {
      alert("Pokój jest pełny!");
    });

    this.serverService.socketListen('invalidRoomCode').subscribe(_ =>
    {
      alert("Kod pokoju jest niepoprawny!");
    });

    this.serverService.socketListen('invalidRoomData').subscribe(_ =>
    {
      alert("Coś poszło nie tak i to nie moja wina");
    });

    this.serverService.socketListen<Server>('joinedServer').subscribe(server =>
    {
      console.log(server);
      this.serverService.server = server;
      this.router.navigate([`hub/${this.serverService.server.code}`]);
    });

  }

  createUser()
  {
    this.logger.log("createUser()");
    this.serverService.socketEmit('createUser', this.formdata.username);
  }

  onJoin() : void
  {
    this.displayJoin = true;
    this.chooseOption = false;
    this.logger.log("onJoin()");
  }

  onCreate() : void
  {
    this.logger.log("onCreate()");
    this.serverService.socketEmit('createServer', this.formdata.username);
  }


  joinServer() : void
  {
    this.logger.log("joinServer()");
    this.serverService.socketEmit('joinServer', JSON.stringify(this.formdata));
  }

}
