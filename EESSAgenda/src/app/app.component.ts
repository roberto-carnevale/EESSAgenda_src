import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utente } from 'src/models/model';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
//Messaging System
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private data: DataService,
    private http: HttpClient
  ) {}
  title = 'EESSAgenda';
  nome: string | undefined = undefined;
  ruolo: number | undefined = undefined;
  messaggi: number = 0;
  messaggiCorso = 0;
  messaggiPersonali = 0;
  private utente: Utente | undefined = undefined;

  ngOnInit(): void {
    this.auth.subscribeAuth().subscribe((loggedIn) => {
      if (loggedIn) {
        this.utente = this.auth.getUserData();
        this.nome = this.utente.nome;
        this.ruolo = this.utente.ruolo;
        this.utente.bacheca
          ? (this.messaggi = this.utente.bacheca?.length)
          : (this.messaggi = 0);
        this.auth.updateOnUserData().subscribe((u) => {
          u!.bacheca
            ? (this.messaggiPersonali = u!.bacheca.length)
            : (this.messaggiPersonali = 0);
          this.messaggi = this.messaggiCorso + this.messaggiPersonali;
        });

        this.data
          .leggiBachecaCorso(this.utente.corso)
          .subscribe((bachecaCorso) => {
            bachecaCorso
              ? (this.messaggiCorso = bachecaCorso.length)
              : (this.messaggiCorso = 0);
            this.messaggi = this.messaggiCorso + this.messaggiPersonali;
          });
      } else {
        this.utente = undefined;
        this.ruolo = undefined;
        this.nome = undefined;
        this.messaggi = 0;
      }
    });
    //Messaging System Initialize
    this.requestPermission();
    this.listen();
  }

  logOut(): void {
    this.auth.setUser(null);
    this.router.navigate(['/login']);
  }

  //Messaging Sysstem
  message: any = null;
  token:string = ""

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Hurraaa!!! we got the token.....');
          this.token = currentToken;
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      window.alert('Message received.\n' + payload.notification?.body);
      console.log('payload', payload)
      this.message = payload;
    });
  }

  sendMessage() {
    const serverToken =
      'AAAAkPFcNJI:APA91bGzPKAsTo5cJDKYYbsL5ncyBkhQrZhs3nvz5ICM9Gx0ibcvKjKB3P0Tv9kH4o_ul3daUbIJ9LGvsiowJdBoOjHCYTYkzoD_wZhEDLhb2l5u7kWDH6UVxirypUz7LplHX_QaJEoe';
    const privatekey = 'LqweHyOgFim73b39E5x2BdmMf68DOD61mLHUQIOf8BE';
    const headers = {
      Authorization: 'key=' + serverToken,
      'Content-Type': 'application/json',
    };
    this.http.post("https://fcm.googleapis.com/fcm/send", {"notification": {"title":"Title Test", "body":"Test Message"}, to: this.token}, { headers }).subscribe()
  }
}
