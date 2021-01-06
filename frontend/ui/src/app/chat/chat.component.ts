import { Socket } from 'ngx-socket-io'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private socket : Socket) { }
  messeges = this.socket.fromEvent<string[]>('messeges');
  ngOnInit(): void {
    
  }

  getMsg(id : number)
  {
    this.socket.emit('getMsg', id);
  }

  sendMgs(msg : string)
  {
    this.socket.emit('sendMsg', msg);
  }

}
