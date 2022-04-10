import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin.router';

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


const Components = [
  CorsiComponent,
  CreazioneAgendaComponent,
  GestioneUtentiComponent,
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
]

@NgModule({
  imports: Modules,
  exports: Components,
  declarations: Components,
  providers: [],
})
export class AdminModule {}
