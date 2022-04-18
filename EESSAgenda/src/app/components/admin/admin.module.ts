import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin.routing';

import { CorsiComponent } from './corsi/corsi.components';
import { CreazioneAgendaComponent } from './creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from './utenti/gestioneUtenti.component';


import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatCardModule } from '@angular/material/card';
import { MessaggiUtentiComponent } from './messaggi/messaggiUtenti.component';


const Components = [
  CorsiComponent,
  CreazioneAgendaComponent,
  GestioneUtentiComponent,
  MessaggiUtentiComponent,
];
const Modules = [
  CommonModule,
  AdminRoutingModule,
  MatButtonModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
]

@NgModule({
  imports: Modules,
  exports: Components,
  declarations: Components,
  providers: [],
})
export class AdminModule {}
