import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMusikComponent } from './show-musik.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('ShowMusikComponent', () => {
  let component: ShowMusikComponent;
  let fixture: ComponentFixture<ShowMusikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(IO_CONFIG)],
      declarations: [ ShowMusikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMusikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
