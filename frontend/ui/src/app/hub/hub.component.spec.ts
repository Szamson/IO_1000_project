import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubComponent } from './hub.component';

import {RouterTestingModule} from "@angular/router/testing";

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const IO_CONFIG:SocketIoConfig = {url:'ws://localhost:3000', options: {}}

describe('HubComponent', () => {
  let component: HubComponent;
  let fixture: ComponentFixture<HubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SocketIoModule.forRoot(IO_CONFIG)],
      declarations: [ HubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
