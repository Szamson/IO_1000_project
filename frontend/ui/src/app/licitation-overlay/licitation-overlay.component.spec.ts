import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitationOverlayComponent } from './licitation-overlay.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('LicitationOverlayComponent', () => {
  let component: LicitationOverlayComponent;
  let fixture: ComponentFixture<LicitationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicitationOverlayComponent, SocketIoModule.forRoot(IO_CONFIG) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicitationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
