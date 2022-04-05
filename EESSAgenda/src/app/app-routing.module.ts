import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrenotazioniComponent } from 'src/app/components/esercitante/prenotazioni/prenotazioni.component'
import { NotFound404Component } from './404.component';
import { CorsiComponent } from './components/admin/corsi/corsi.components';
import { CreazioneAgendaComponent } from './components/admin/creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from './components/admin/utenti/gestioneUtenti.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [{ path:"" , component: PrenotazioniComponent },
  { path:"prenotazioni/:id" , component: PrenotazioniComponent },
{path:'corsi', component:CorsiComponent},
{path:'utenti', component:GestioneUtentiComponent},
{path:'creazioneAgenda/:id', component:CreazioneAgendaComponent},
{path:'login', component:LoginComponent},
{path:'**', component:NotFound404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
