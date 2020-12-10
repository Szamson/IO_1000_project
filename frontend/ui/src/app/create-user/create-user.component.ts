import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import { UserinfoService } from '../userinfo.service';

import {ServerInfo} from '../serverinfo'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(private logger : LoggerService, 
    private userinfo : UserinfoService) { }

  userdata : ServerInfo = new ServerInfo();

  displayJoin : boolean = false;
  displayCreate : boolean = false;


  onSubmit() : void
  {

  }

  onJoin() : void
  {
    this.logger.log("Joined!");
    this.displayJoin = true;
  }

  onCreate() : void
  {
    this.logger.log("Created!");
    this.displayCreate = true;
  }

  ngOnInit(): void {
  }

}
