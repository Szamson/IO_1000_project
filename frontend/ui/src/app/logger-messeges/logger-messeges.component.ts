import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-logger-messeges',
  templateUrl: './logger-messeges.component.html',
  styleUrls: ['./logger-messeges.component.css']
})
export class LoggerMessegesComponent implements OnInit {

  constructor(public loggerService : LoggerService) { }

  ngOnInit(): void {
  }

}
