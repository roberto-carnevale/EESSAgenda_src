import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CorsiComponent } from 'src/app/components/admin/corsi/corsi.components';
import { CreazioneAgendaComponent } from 'src/app/components/admin/creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from 'src/app/components/admin/utenti/gestioneUtenti.component';

export const routes: Routes = [
    {path:'corsi', component:CorsiComponent},
    {path:'utenti', component:GestioneUtentiComponent},
    {path:'creazioneAgenda/:id', component:CreazioneAgendaComponent},
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

