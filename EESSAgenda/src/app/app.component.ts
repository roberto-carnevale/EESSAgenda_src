import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Utente } from 'src/models/model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}
  title = 'EESSAgenda';
  nome: string | undefined = undefined;
  ruolo : number | undefined = undefined;
  messaggi: number = 0
  private utente : Utente | undefined = undefined;

  ngOnInit(): void {
    this.auth.subscribeAuth().subscribe((loggedIn) => {
      if (loggedIn) {
        this.utente = this.auth.getUserData();
        this.nome = this.utente.nome;
        this.ruolo = this.utente.ruolo;
        this.utente.bacheca?this.messaggi = this.utente.bacheca?.length:this.messaggi=0;
        this.auth.updateOnUserData().subscribe(u => { this.utente = u[0]; this.utente.bacheca?this.messaggi = this.utente.bacheca?.length:this.messaggi=0;});
      } else {
        this.utente = undefined;
        this.ruolo = undefined;
        this.nome = undefined;
      }
    });
  }

  logOut(): void {
    this.auth.setUser(null);
    this.router.navigate(['/login']);
  }
}
