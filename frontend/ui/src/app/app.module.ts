import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'

import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { LoggerMessegesComponent } from './logger-messeges/logger-messeges.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { HubComponent } from './hub/hub.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoggerMessegesComponent,
    CreateUserComponent,
    HubComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
