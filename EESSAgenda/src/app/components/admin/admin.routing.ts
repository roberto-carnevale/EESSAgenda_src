import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CorsiComponent } from 'src/app/components/admin/corsi/corsi.components';
import { CreazioneAgendaComponent } from 'src/app/components/admin/creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from 'src/app/components/admin/utenti/gestioneUtenti.component';
import { MessaggiUtentiComponent } from './messaggi/messaggiUtenti.component';
import { AllegatiAdminComponent } from './allegati/allegatiAdmin.component';
import { LoginGuard } from 'src/app/services/guard.service';

export const routes: Routes = [
    {path:'corsi', component:CorsiComponent , canActivate: [LoginGuard]},
    {path:'utenti', component:GestioneUtentiComponent, canActivate: [LoginGuard]},
    {path:'creazioneAgenda/:id', component:CreazioneAgendaComponent, canActivate: [LoginGuard]},
    {path:'messaggi/:id', component:MessaggiUtentiComponent, canActivate: [LoginGuard]},
    {path:'allegati/:id', component:AllegatiAdminComponent, canActivate: [LoginGuard]}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

