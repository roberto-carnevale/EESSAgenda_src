import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router'
import { LoginGuard } from 'src/app/services/guard.service';

import { GuidaComponent } from './guida.component';

export const routes: Routes = [
  {path:'', component:GuidaComponent, canActivate: [LoginGuard]},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidaRoutingModule { }



