import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { SignInComponent } from './components/login/signin/signin.component';
import { LoginComponent } from './components/login/login.component';
import { SemaforoComponent } from './components/esercitante/semaforo/semaforo.component';
import { PrenotazioniComponent } from './components/esercitante/prenotazioni/prenotazioni.component';
import { BachecaComponent } from './components/bacheca/bacheca.component';
import { AllegatiComponent } from './components/esercitante/allegati/allegati.component';



@NgModule({
  declarations: [
    AppComponent,
    PrenotazioniComponent,
    LoginComponent,
    SemaforoComponent,
    BachecaComponent,
    SignInComponent,
    AllegatiComponent
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
    MatNativeDateModule,
    MatToolbarModule,
    MatCardModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
  providers: [ AuthService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'it-IT'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
