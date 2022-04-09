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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar';

import { AdminModule } from './components/admin/admin.module';

import { LoginComponent } from './components/login/login.component';
import { GuidaComponent } from './components/guida/guida.component';
import { SemaforoComponent } from './components/esercitante/semaforo/semaforo.component';

import { AuthService } from './services/auth.service';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    DataComponent,
    PrenotazioniComponent,
    LoginComponent,
    GuidaComponent,
    SemaforoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    //RouterModule.forRoot(routes)
    AdminModule,
  ],
  providers: [ AuthService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'it-IT'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
