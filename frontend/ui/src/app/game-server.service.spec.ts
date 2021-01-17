import { TestBed } from '@angular/core/testing';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { GameServerService } from './game-server.service';

const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('GameServerService', () => {
  let service: GameServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(IO_CONFIG)]
    });
    service = TestBed.inject(GameServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
