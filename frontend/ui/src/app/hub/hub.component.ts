import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  constructor( public logger : LoggerService ) { }

  usernames : string[] = ["jan", "kowal"];

  isHost : boolean = false;

  addBot() : void
  {
    this.logger.log("added bot");
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
  }

}
