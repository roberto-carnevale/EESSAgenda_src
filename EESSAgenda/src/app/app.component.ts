import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utente } from 'src/models/model';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private data: DataService
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
          this.messaggi = this.messaggiCorso+this.messaggiPersonali;
        });

        this.data
          .leggiBachecaCorso(this.utente.corso)
          .subscribe((bachecaCorso) => {
            bachecaCorso
              ? (this.messaggiCorso = bachecaCorso.length)
              : (this.messaggiCorso = 0);
            this.messaggi = this.messaggiCorso+this.messaggiPersonali;
          });
      } else {
        this.utente = undefined;
        this.ruolo = undefined;
        this.nome = undefined;
        this.messaggi=0;
      }
    });
  }

  logOut(): void {
    this.auth.setUser(null);
    this.router.navigate(['/login']);
  }
}
