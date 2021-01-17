import { ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";

import { LicitationOverlayComponent } from './licitation-overlay.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { GameServerService } from '../game-server.service';
import { NotFoundComponent } from '../not-found/not-found.component';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

const routes = [
  {path:"pageNotFound", component:NotFoundComponent},
  {path:"**", redirectTo:'user'}
];

describe('LicitationOverlayComponent', () => {
  let component: LicitationOverlayComponent;
  let fixture: ComponentFixture<LicitationOverlayComponent>;

  let stub = {
    getLicitationAmount: () => 100,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [SocketIoModule.forRoot(IO_CONFIG),
        RouterTestingModule.withRoutes(routes)],
      declarations: [ LicitationOverlayComponent],
      providers: [ {provide : GameServerService, useValue :  stub} ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicitationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.licitationValue = 100;
    component.number = 100;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment its value by 10', () =>{
    component.increase();
    expect(component.number).toBe(110);
  });

  it('shouldnt decrement below the starting value', () =>{
    component.decrease()
    expect(component.number).toBe(100);
  })

});
