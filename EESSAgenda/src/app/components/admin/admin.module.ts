import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

import { CorsiComponent } from './corsi/corsi.components';
import { CreazioneAgendaComponent } from './creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from './utenti/gestioneUtenti.component';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar';

const Components = [
  CorsiComponent,
  CreazioneAgendaComponent,
  GestioneUtentiComponent,
];
const Modules = [
  AngularFirestoreModule,
  MatButtonModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
]

@NgModule({
  imports: Modules,
  exports: Components,
  declarations: Components,
  providers: [AuthService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'it-IT'}],
})
export class AdminModule {}
