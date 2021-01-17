import { ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";

import { LicitationOverlayComponent } from './licitation-overlay.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('LicitationOverlayComponent', () => {
  let component: LicitationOverlayComponent;
  let fixture: ComponentFixture<LicitationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [SocketIoModule.forRoot(IO_CONFIG),
        RouterTestingModule],
      declarations: [ LicitationOverlayComponent]
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
