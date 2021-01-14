import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular//router';
import { GameComponent } from './game/game.component';
import { CreateUserComponent } from './create-user/create-user.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { HubComponent } from './hub/hub.component';
import { MusikExchangeComponent } from './musik-exchange/musik-exchange.component';

const routes : Routes = [
  {path:"musik", component:MusikExchangeComponent},
  {path:"game/:id", component:GameComponent},
  {path:"user", component:CreateUserComponent},
  {path:"hub/:id", component:HubComponent},
  {path:"pageNotFound", component:NotFoundComponent},
  {path:"**", redirectTo:'user'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
