import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable, of} from 'rxjs';
import {map, tap, catchError} from 'rxjs/operators';


import { LoggerService } from './logger.service';
import {User} from './user'

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  readonly userURL = 'api/user'; 

  httpOptions = {
    headers : new HttpHeaders({'Content-type' : 'application/json'})
  };

  private handleError<T>(operation = 'operation', result ?: T)
  {
    return (error:any) : Observable<T> => { this.logger.log(`Error with $operation`); return of(result as T); }
  }

  getUser (code : string) : Observable<User>
  {
    return this.http.get<User>(`$this.userURL/$code`, this.httpOptions).pipe(tap( _ => catchError(this.handleError<any>(`get user`)) ));
  }

  createUser( username : string ) : Observable<User>
  {
    return this.http.post<User>(this.userURL, username, this.httpOptions);
  }

  constructor(public logger : LoggerService, private http : HttpClient) { }
}
