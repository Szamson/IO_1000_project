
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, tap, catchError} from 'rxjs/operators';


import { LoggerService } from './logger.service';
import {User} from './user'

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  private handleError<T>(operation = 'operation', result ?: T)
  {
    return (error:any) : Observable<T> => { this.logger.log(`Error with ${operation}`); return of(result as T); }
  }

  constructor(public logger : LoggerService) { }
}