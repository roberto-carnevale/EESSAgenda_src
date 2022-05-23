import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from 'src/app/services/guard.service';
import { PrenotazioniComponent } from './prenotazioni.component';

export const routes: Routes = [
  {path:"", component:PrenotazioniComponent, canActivate: [LoginGuard]}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrenotazioniRoutingModule { }

//
