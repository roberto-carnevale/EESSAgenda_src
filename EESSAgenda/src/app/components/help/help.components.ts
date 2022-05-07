import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { Utente, TipoUtente } from 'src/models/model';

@Component({
  selector: 'app-help',
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.css'],
})
export class HelpComponent implements OnInit {
  constructor(private firebase: AngularFirestore, private auth: AuthService) {}
  ruolo: TipoUtente = TipoUtente.Esercitante;
  Guida = TipoUtente.Guida;
  GuidaSmart = TipoUtente.GuidaSmart;
  Gestore = TipoUtente.Gestore;
  login = false;

  ngOnInit() {
    if (this.auth.getUserData().email) {
      this.firebase
        .collection<Utente>('utenti')
        .doc(this.auth.getUserData().email)
        .valueChanges()
        .pipe(take(1))
        .subscribe((s) => {
          console.log('Utente', s);
          if (s !== undefined) {
            console.log('ruolo', s.ruolo);
            this.ruolo = s.ruolo;
            this.login = true;
          } else {
            console.log('no_login');
            this.ruolo = TipoUtente.Esercitante;
          }
        });
    } else {
      console.log('no_login');
      this.ruolo = TipoUtente.Esercitante;
    }
  }
}

//
