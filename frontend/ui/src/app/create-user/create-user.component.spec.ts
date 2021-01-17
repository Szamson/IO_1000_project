import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from '@angular/forms'

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, 
                SocketIoModule.forRoot(IO_CONFIG),
                FormsModule],
      declarations: [ CreateUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
