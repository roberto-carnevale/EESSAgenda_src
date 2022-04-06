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
    uid: '',
    corso: '',
    nome: '',
    ruolo: TipoUtente.Esercitante,
    id:''
  };

  private isAuth: boolean = false;

  constructor(
    private authFirebase: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  creaCorso(nome: string) {
    this.firestore.collection('/corsi').add({ corso: nome }).then().catch();
  }

  cancellaCorso(corso: string) {
    this.firestore
      .collection('/corsi', (ref) => ref.where('corso', '==', corso))
      .get()
      .forEach((qs) => qs.docs.forEach((doc) => doc.ref.delete()));
  }

  leggiCorsi(): Observable<Corso[]> {
    return this.firestore.collection<Corso>('/corsi').valueChanges();
  }

  leggiUtenti(): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti')
      .valueChanges({ idFields: 'id' });
  }

  leggiGuide(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) =>
        ref.where('corso', '==', corso).where('ruolo', '==', 2)
      )
      .valueChanges({ idFields: 'id' });
  }

  leggiAgendaGuida(guida: Utente): Observable<{ora:string, esercitante:string}[]> {
    let qs = this.firestore.collection<Slots>('/agenda', (ref) =>
      ref.where('corso', '==', guida.corso).where('email','==',guida.email).orderBy('inizio', 'asc')
    );
    return qs.valueChanges().pipe(
      map((l) => {
        return l.map((s) => {
          let res = {ora: new Date(s.inizio).toLocaleString("it-IT"), esercitante:""};
          if (s.occupato != "") {res.esercitante = s.occupato};
          return res;
        });
      })
    );
  }

  statoGuida(guida:string):Observable<boolean> {
    return this.firestore.collection<Utente>('utenti', ref => ref.where('email','==',guida)).valueChanges().pipe( map((u)=> u[0].in_colloquio!));
  }

  cambiaStato(utente:Utente) {
    this.firestore.collection('utenti').doc(utente.id).update(utente);
  }
  creaGuida(nome: string, corso: string, email: string, password: string) {
    let utente: Utente = {
      uid: '',
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Guida,
      email: email,
      id:''
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        utente.uid = cred.user?.uid!;
        this.firestore
          .collection('/utenti')
          .add(utente)
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
      uid: '',
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Esercitante,
      email: email,
      id:''
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        utente.uid = cred.user?.uid!;
        this.firestore
          .collection('/utenti')
          .add(utente)
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
}
