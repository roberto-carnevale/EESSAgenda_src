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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';


import { SignInComponent } from './components/login/signin/signin.component';
import { LoginComponent } from './components/login/login.component';
import { BachecaComponent } from './components/bacheca/bacheca.component';
import { AllegatiComponent } from './components/esercitante/allegati/allegati.component';
import { ChatComponent } from './components/esercitante/chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BachecaComponent,
    SignInComponent,
    AllegatiComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatBadgeModule,
  ],
  providers: [ AuthService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'it-IT'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
