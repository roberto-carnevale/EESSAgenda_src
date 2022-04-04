import { Injectable } from '@angular/core';
import { Slots, Agenda, Utente, TipoUtenti, Corso } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  public changedAuth = new Subject<boolean>();
  private utente: Utente = {
    email: '',
    uid: '',
    corso: '',
    nome: '',
    ruolo: 1,
  };
  private agenda: Agenda = {
    id: '',
    slot: [],
    corso: '',
    guida: '',
    url: '',
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
    this.firestore.collection('/corsi', ref => ref.where('corso','==',corso)).get().forEach( qs => qs.docs.forEach( doc => doc.ref.delete()));
  }

  leggiCorsi(): Observable<Corso[]> {
    return this.firestore
        .collection<Corso>('/corsi')
        .valueChanges();
  }

  creaGuida(nome: string, corso: string, email: string, password: string) {
    let utente: Utente = {
      uid: '',
      corso: corso,
      nome: nome,
      ruolo: TipoUtenti.giuda,
      email: email,
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        utente.uid = cred.user?.uid!;
        this.firestore.collection('/users').add(utente).then().catch();
      });
  }

  creaEsercitatnte(
    nome: string,
    corso: string,
    email: string,
    password: string
  ) {
    let utente: Utente = {
      uid: '',
      corso: corso,
      nome: nome,
      ruolo: TipoUtenti.esercitante,
      email: email,
    };
    this.authFirebase
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        utente.uid = cred.user?.uid!;
        this.firestore.collection('/users').add(utente).then().catch();
      });
  }
}
