import { Injectable } from '@angular/core';
import { Slots, Utente, TipoUtente, Corso, File } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  public changedAuth = new Subject<boolean>();

  private utente: Utente = {
    email: '',
    corso: '',
    nome: '',
    ruolo: TipoUtente.Esercitante,
  };

  private isAuth: boolean = false;

  constructor(
    private authFirebase: AngularFireAuth,
    private firestore: AngularFirestore,
    private auth: AuthService,
  ) {}
  ///////////
  // UTENTI
  ///////////
  leggiUtentiCorso(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) => ref.where('corso', '==', corso))
      .valueChanges();
  }

  cercaUtente(utenteEmail: string): Observable<Utente | undefined> {
    return this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges();
  }
  ///////////
  // BACHECA
  ///////////
  leggiBachecaCorso(corso: string): Observable<string[] | undefined> {
    return this.firestore
      .collection<{ corso: string; info: string[] }>('corsi')
      .doc(corso)
      .valueChanges()
      .pipe(map((c) => c?.info));
  }

  ///////////
  // GUIDE
  ///////////
  statoGuida(guidaEmail: string): Observable<boolean> {
    return this.firestore
      .collection<Utente>('utenti', (ref) =>
        ref.where('email', '==', guidaEmail)
      )
      .valueChanges()
      .pipe(map((u) => u[0].in_colloquio!));
  }

  cambiaStato(utente: Utente) {
    this.firestore.collection('utenti').doc(utente.email).update(utente);
  }

  leggiAgendaGuida(
    guida: Utente
  ): Observable<{ ora: string; esercitante: string }[]> {
    let qs = this.firestore.collection<Slots>('/agenda', (ref) =>
      ref
        .where('corso', '==', guida.corso)
        .where('guida', '==', guida.email)
        .orderBy('inizio', 'asc')
    );
    return qs.valueChanges().pipe(
      map((l) => {
        return l.map((s) => {
          let res = {
            ora: new Date(s.inizio).toLocaleString('it-IT'),
            esercitante: '',
          };
          if (s.occupato != '') {
            res.esercitante = s.occupato;
          }
          return res;
        });
      })
    );
  }

  nomeUtente(email: string): Promise<string> {
    return new Promise((resolve) => {
      return this.firestore
        .collection<Utente>('/utenti')
        .doc(email)
        .valueChanges()
        .pipe(
          take(1),
          map((lu) => {
            return lu!.nome;
          })
        )
        .subscribe((n) => {
          resolve(n);
        });
    });
  }

  /////////////
  // SELF-SERVICE SIGNIN
  ////////////
  creaEsercitanteDaLink(
    nome: string,
    corso: string,
    email: string,
    password: string
  ) {
    let utente: Utente = {
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Esercitante,
      email: email,
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        this.firestore
          .collection('/utenti')
          .doc(utente.email)
          .set(utente)
          .then()
          .catch(err =>window.alert("Errore di creazione"));
      })
      .catch((err) => {
        window.alert(err);
      });
  }

  ///////
  //SLOT
  ///////
  leggiSlot(corso: string): Observable<Slots[]> {
    return this.firestore
      .collection<Slots>('/agenda', (ref) =>
        ref
          .where('corso', '==', corso)
          .orderBy('guida', 'asc')
          .orderBy('inizio', 'asc')
      )
      .valueChanges({ idField: 'id' });
  }

  prenotaSlot(slot: Slots) {
    this.firestore.collection('agenda').doc(slot.id).update(slot).then();
  }
  ///////
  //ALLEGATI
  ///////
  leggiAllegati(corso: string): Observable<File[] | undefined> {
    return this.firestore
      .collection<Corso>('corsi')
      .doc(corso)
      .valueChanges()
      .pipe(map((c) => c?.allegati));
  }
}
