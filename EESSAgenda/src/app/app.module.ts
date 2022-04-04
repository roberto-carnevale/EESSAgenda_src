import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataComponent } from './components/data.component';

import { DataService } from './services/data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrenotazioniComponent } from './components/esercitante/prenotazioni/prenotazioni.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { CorsiComponent } from './components/admin/corsi/corsi.components';
import { CreazioneAgendaComponent } from './components/admin/creazioneAgenda/creazioneAgenda.component';
import { GestioneUtentiComponent } from './components/admin/utenti/gestioneUtenti.component';

@NgModule({
  declarations: [
    AppComponent,
    DataComponent,
    PrenotazioniComponent,
    CorsiComponent,
    CreazioneAgendaComponent,
    GestioneUtentiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [ DataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
