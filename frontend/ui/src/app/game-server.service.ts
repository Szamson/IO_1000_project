import {Server} from './server'
import {User} from './user'

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs'
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  readonly serverURL = 'http://localhost:8000/api'

  httpOptions = {
    headers : new HttpHeaders({'Content-type' : 'application/json'})
  };

  getServer(code : string) : Observable<Server>
  {
    this.logger.log(`Getting server of code ${code}`)
    let params = new HttpParams().set('code', code);
    return this.http.get<Server>(`${this.serverURL}/room-get`, {params});
  }

  createServer(host : User) : Observable<Server>
  {
    let data = new Server;
    data.code = null;
    data.host = host.name;
    data.player1 = host.name;
    data.player2 = null;
    data.player3 = null;

    return this.http.post<Server>(`${this.serverURL}/room-create`, data, this.httpOptions);
  }

  constructor(private http : HttpClient, public logger : LoggerService) { }
}
