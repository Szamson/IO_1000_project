
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import {User} from '../user'
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
    private serverService : GameServerService,
    public router : Router) { }

  formdata : FormData = new FormData();

  enterUsername : boolean = true;
  displayJoin : boolean = false;
  chooseOption : boolean = false;

  public users : User[];
  public user : User;

  createUser()
  {
    this.enterUsername = false;
    this.chooseOption = true;
    this.logger.log("createUser()");

    let parameters : User = { id : null, code : null, name : this.formdata.username };
    this.serverService.createUser(parameters).subscribe(user => this.user = user);
  }

  onSubmit() : void
  {
    /*let data : User = new User();
    data.code = null;
    data.id = null;
    data.name = this.userdata.username;
    this.logger.log(data.name);
    this.userinfo.createUser(data).subscribe( u => this.user = u);*/
  }

  onJoin() : void
  {
    this.displayJoin = true;
    this.chooseOption = false;
    this.logger.log("onJoin()");

    /*this.logger.log("Selected join form");*/
  }

  onCreate() : void
  {
    this.logger.log("onCreate()");
    /*let data : User = new User();
    data.code = null;
    data.id = null;
    data.name = this.userdata.username;
    this.logger.log(data.name);
    this.userinfo.createUser(data).subscribe( u => {
      this.user = u
      let serv = new Server();
      console.log(this.user)
      this.serverService.createServer(this.user).subscribe(s => {
        serv = s
        console.log(serv)
        this.router.navigate([`hub/${serv.code}`])
      });
    });*/
  }

  joinServer() : void
  {
    this.logger.log("Joined!");
  }

  ngOnInit(): void {
    this.serverService.getUsers().subscribe( user => this.users = user);
  }

}