import { Injectable } from '@angular/core';
import { Slots, Utente, TipoUtente, Corso } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  creaCorso(nome: string) {
    this.firestore
      .collection('corsi')
      .doc(nome)
      .set({ corso: nome, info: [] })
      .then()
      .catch();
  }

  cancellaCorso(corso: string) {
    this.firestore.collection('corsi').doc(corso).delete().then().catch();
  }

  leggiCorsi(): Observable<Corso[]> {
    return this.firestore.collection<Corso>('/corsi').valueChanges();
  }

  leggiUtenti(): Observable<Utente[]> {
    return this.firestore.collection<Utente>('/utenti').valueChanges();
  }

  leggiUtentiCorso(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) => ref.where('corso', '==', corso))
      .valueChanges();
  }

  leggiGuide(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) =>
        ref.where('corso', '==', corso).where('ruolo', '==', 2)
      )
      .valueChanges();
  }

  nomeGuida(email: string): Promise<string> {
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

  cercaUtente(utenteEmail: string): Observable<Utente | undefined> {
    return this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges();
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

  leggiBachecaCorso(corso: string): Observable<string[] | undefined> {
    return this.firestore
      .collection<{ corso: string; info: string[] }>('corsi')
      .doc(corso)
      .valueChanges()
      .pipe(map((c) => c?.info));
  }

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
  creaGuida(nome: string, corso: string, email: string, password: string) {
    let utente: Utente = {
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Guida,
      email: email,
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        this.firestore
          .collection('/utenti')
          .doc(utente.email)
          .set(utente)
          .then(() => {
            this.authFirebase
              .sendPasswordResetEmail(email)
              .then(() => this.authFirebase.signOut());
          })
          .catch();
      })
      .catch((err) => {
        window.alert(err);
      });
  }

  creaEsercitante(
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
          .then(() => {
            this.authFirebase
              .sendPasswordResetEmail(email)
              .then(() => this.authFirebase.signOut());
          })
          .catch();
      })
      .catch((err) => {
        window.alert(err);
      });
  }

  creaGestore(nome: string, corso: string, email: string, password: string) {
    let utente: Utente = {
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Gestore,
      email: email,
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        this.firestore
          .collection('/utenti')
          .doc(utente.email)
          .set(utente)
          .then(() => {
            this.authFirebase
              .sendPasswordResetEmail(email)
              .then(() => this.authFirebase.signOut());
          })
          .catch();
      })
      .catch((err) => {
        window.alert(err);
      });
  }

  creaSlot(corso: string, guida: string, inizio: string, fine: string) {
    const s: Slots = {
      corso: corso,
      guida: guida,
      inizio: inizio,
      fine: fine,
      occupato: '',
      id: '',
    };
    console.log(s);
    this.firestore.collection<Slots>('/agenda').add(s).then();
  }

  cancellaSlot(slotId: string) {
    this.firestore.collection<Slots>('/agenda').doc(slotId).delete();
  }

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

  cambiaCorso(email: string, corso: string) {
    const id = this.firestore
      .collection('/utenti', (ref) => ref.where('email', '==', email))
      .get()
      .forEach((qs) =>
        qs.forEach((d) =>
          this.firestore
            .collection('/utenti')
            .doc(d.id)
            .update({ corso: corso })
            .then()
        )
      );
  }

  aggiungiMessaggio(utenteEmail: string, messaggio: string) {
    this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u?.bacheca?.push(messaggio);
        this.firestore
        .collection<Utente>('/utenti')
        .doc(utenteEmail).update(u!).then().catch()
      });
  }

  cancellaMessaggi(utenteEmail: string) {
    this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u!.bacheca! = [];
        this.firestore
        .collection<Utente>('/utenti')
        .doc(utenteEmail).update(u!).then().catch()
      });
  }

  aggiungiMessaggioCorso(corso: string, messaggio: string) {
    this.firestore
      .collection<{corso:string, info: string[]}>('/corsi')
      .doc(corso)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u?.info?.push(messaggio);
        this.firestore
        .collection<{corso:string, info: string[]}>('/corsi')
        .doc(corso).update(u!).then().catch()
      });
  }

  cancellaMessaggioCorso(corso: string, msg: string){
    this.firestore
    .collection<{corso:string, info: string[]}>('/corsi')
    .doc(corso)
    .valueChanges()
    .pipe(take(1))
    .subscribe((u) => {
      u!.info! = u!.info!.filter( m => m !== msg);
      this.firestore
      .collection<{corso:string, info: string[]}>('/corsi')
      .doc(corso).update(u!).then().catch()
    });
  }
}
