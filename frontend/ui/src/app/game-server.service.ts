import {Server} from './server'
import {User} from './user'
import {GameState} from './gameState'

import { Socket } from 'ngx-socket-io'

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from 'rxjs'

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  readonly serverURL = 'http://localhost:8000/api'

  user : User;
  server : Server;
  gameState : GameState;

  licitationAmount : Number;

  constructor(private http : HttpClient, 
    public logger : LoggerService, 
    private socket : Socket) { }

  socketListen<T>(eventName : string) : Observable<T>
  {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
      subscriber.next(data) }
      )}
    )} 

  socketEmit(eventName : string, data : string)
  {
    this.socket.emit(eventName, data);
  }

  httpOptions = {
    headers : new HttpHeaders({'Content-type' : 'application/json'})
  };

  getServer(code : string) : Observable<Server>
  {
    this.logger.log(`Getting server of code ${code}`)
    let params = new HttpParams().set('code', code);
    return this.http.get<Server>(`${this.serverURL}/room-get`, {params});
  }

  joinServer(code : string, name : string) : Observable<Server>
  {
    this.logger.log(`Joining server of code ${code}`)
    let params = new HttpParams().set('code', code);
    return this.http.get<Server>(`${this.serverURL}/room-join`, {params});
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
}
