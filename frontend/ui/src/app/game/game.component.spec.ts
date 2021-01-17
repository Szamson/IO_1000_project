import { ComponentFixture, TestBed } from '@angular/core/testing';

import {OverlayModule} from '@angular/cdk/overlay';

import { GameComponent } from './game.component';
import { NotFoundComponent } from '../not-found/not-found.component'

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { RouterTestingModule } from '@angular/router/testing';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

const routes = [
  {path:"pageNotFound", component:NotFoundComponent},
  {path:"**", redirectTo:'user'}
];

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent],
      imports: [OverlayModule,
        SocketIoModule.forRoot(IO_CONFIG),
        RouterTestingModule.withRoutes(routes)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
