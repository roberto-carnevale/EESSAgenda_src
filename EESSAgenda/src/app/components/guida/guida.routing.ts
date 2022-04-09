import { NgModule } from '@angular/core';
import { Routes , RouterModule } from '@angular/router'

import { GuidaComponent } from './guida.component';

export const routes: Routes = [
  {path:'', component:GuidaComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidaRoutingModule { }



