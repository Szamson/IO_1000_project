import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular//router';
import { GameComponent } from './game/game.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HubComponent } from './hub/hub.component';

const routes : Routes = [
  {path:"game", component:GameComponent},
  {path:"user", component:CreateUserComponent},
  {path:"hub", component:HubComponent},
  {path:"**", redirectTo:'user'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }