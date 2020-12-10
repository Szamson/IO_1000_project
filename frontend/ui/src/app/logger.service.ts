import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  messeges : string[] = [];

  log(messege : string) : void
  {
    this.messeges.push(messege);
  }

  clear() : void
  {
    this.messeges = [];
  }

  constructor() { }
}
