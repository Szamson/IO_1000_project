import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

const config : SocketIoConfig = {url:'ws://localhost:3000', options: {}}

import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { LoggerMessegesComponent } from './logger-messeges/logger-messeges.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { HubComponent } from './hub/hub.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LicitationOverlayComponent } from './licitation-overlay/licitation-overlay.component';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { MusikExchangeComponent } from './musik-exchange/musik-exchange.component';
import { ShowMusikComponent } from './show-musik/show-musik.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoggerMessegesComponent,
    CreateUserComponent,
    HubComponent,
    NotFoundComponent,
    LicitationOverlayComponent,
    MusikExchangeComponent,
    ShowMusikComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    SocketIoModule.forRoot(config),
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
