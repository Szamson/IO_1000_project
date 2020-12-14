
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import {User} from '../user'
import {Server} from '../server'
import {Router} from '@angular/router'

import { GameServerService } from '../game-server.service';
import {FormData} from '../form-data'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoggerMessegesComponent } from '../logger-messeges/logger-messeges.component';

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
  exists : boolean = false;

  public users : User[];
  public user : User;

  createUser()
  {
    this.logger.log("createUser()");
    this.serverService.createUser(this.formdata.username).pipe(catchError( error => 
    {
      this.logger.log(error.message);
      if(error.status == 400)
      {
        this.exists = true;
      }
      throw new Error("Failed to create user");
    } )).subscribe(user => {this.user = user
      this.enterUsername = false;
      this.chooseOption = true;
      this.exists = false;});
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

    this.serverService.createServer(this.user)
      .pipe(catchError(error =>{this.logger.log("Failed to create server");throw new Error("Failed to create server");}))
      .subscribe(server => {
        this.serverService.user = this.user;
        this.router.navigate([`hub/${server.code}`]);
        });

  }

  joinServer() : void
  {

    let server : Server;
    this.serverService.getServer(this.formdata.serverCode)
      .pipe(catchError(error => {this.logger.log("Failed to join server");throw new Error("Failed to join server")}))
      .subscribe(serv => {server = serv
        this.serverService.user = this.user;
        this.router.navigate([`hub/${server.code}`])
      });

  }

  ngOnInit(): void {
    try
    {
      this.serverService.getUsers()
      .pipe(catchError(error => {throw Error("Failed to fetch user list")}))
      .subscribe( user => this.users = user);
    }
    catch(e)
    {
      this.logger.log(e.message);
    }
  }

}