import {Server} from './server'

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs'
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  readonly serverURL = 'api/server'

  httpOptions = {
    headers : new HttpHeaders({'Content-type' : 'application/json'})
  };

  getServer(code : string) : Observable<Server>
  {
    this.logger.log(`Getting server of code $code`)
    return this.http.get<Server>(`$this.serverURL\$code`);
  }

  createServer(username : string) : Observable<Server>
  {
    return null;
  }

  constructor(private http : HttpClient, public logger : LoggerService) { }
}
