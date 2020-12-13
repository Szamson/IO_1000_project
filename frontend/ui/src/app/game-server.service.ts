import {Server} from './server'
import {User} from './user'

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from 'rxjs'
import {map} from 'rxjs/operators'
import {catchError} from 'rxjs/operators'

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  readonly serverURL = 'http://localhost:8000/api'

  user : User;

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

  createUser(username : string) : Observable<User>
  {
    let params : User = {name:username, id:null, code:null};
    return this.http.post<User>(`${this.serverURL}/player-create`, params);
  }

  getUsers() : Observable<User[]>
  {
    return this.http.get<User[]>(`${this.serverURL}/players`);
  }

  getUser() : Observable<User>
  {
    return this.http.get<User>(`${this.serverURL}`)
  }

  constructor(private http : HttpClient, public logger : LoggerService) { }
}
