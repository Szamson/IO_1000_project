import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusikExchangeComponent } from './musik-exchange.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('MusikExchangeComponent', () => {
  let component: MusikExchangeComponent;
  let fixture: ComponentFixture<MusikExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(IO_CONFIG)],
      declarations: [ MusikExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusikExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
