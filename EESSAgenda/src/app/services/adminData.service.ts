//
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  ChatMessage,
  Corso,
  File,
  Slots,
  TipoUtente,
  Utente,
  OpzioniPiattaforma,
} from 'src/models/model';
import { AuthService } from './auth.service';

import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  constructor(
    private authFirebase: AngularFireAuth,
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {}

  //////
  //GESTIONE CORSI
  //////
  cancellaCorso(corso: string) {
    this.firestore.collection('chat').doc(corso).delete();
    this.firestore.collection('home').doc(corso).delete();
    this.firestore.collection('corsi').doc(corso).delete();
    this.firestore.collection('signinkey').doc(corso).delete();
  }

  creaCorso(nome: string) {
    this.firestore.collection('chat').doc(nome).set({ chat: [] }).then();
    this.firestore
      .collection('home')
      .doc(nome)
      .set({
        contenuto:
          '<h1>Benvenuto a ' +
          nome +
          '</h1><p>Questa è la home page di ' +
          nome,
      })
      .then();
    this.firestore
      .collection('signinkey')
      .doc(nome)
      .set({ chiave: this.generaStringCasuale(50), corso: nome })
      .then();
    this.firestore
      .collection('corsi')
      .doc(nome)
      .set({
        corso: nome,
        info: [],
        opzioni: [
          OpzioniPiattaforma.Chat,
          OpzioniPiattaforma.File,
          OpzioniPiattaforma.Prenotazioni,
        ],
      })
      .then()
      .catch();
  }

  opzioniCorso(nome: string, opzioni: number[]) {
    this.firestore
      .collection('corsi')
      .doc(nome)
      .update({ opzioni: opzioni })
      .then()
      .catch();
  }

  private generaStringCasuale(len: number): string {
    const data =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const datalen = data.length;
    let res: string = '';
    for (let i = 0; i < len; i++) {
      res += data.charAt(Math.random() * datalen);
    }
    return res;
  }

  leggiSignInURL(corso: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let urlReturn =
        window.location.protocol + '//' + window.location.host + '/signin/';
      this.firestore
        .collection<{ chiave: string; corso: string }>('signinkey')
        .doc(corso)
        .valueChanges()
        .pipe(
          take(1),
          map((d) => d?.chiave)
        )
        .subscribe((chiave) => {
          if (chiave) {
            resolve(urlReturn + chiave);
          } else {
            reject('');
          }
        });
    });
  }
  leggiCorsi(): Observable<Corso[]> {
    if (this.auth.getUserData().ruolo == TipoUtente.Amministratore)
      return this.firestore.collection<Corso>('/corsi').valueChanges();
    else
      return this.firestore
        .collection<Corso>('/corsi', (ref) =>
          ref.where('corso', '==', this.auth.getUserData().corso)
        )
        .valueChanges();
  }

  ///////
  //GESTIONE UTENTI
  ///////

  leggiUtenti(): Observable<Utente[]> {
    if (this.auth.getUserData().ruolo == TipoUtente.Amministratore)
      return this.firestore.collection<Utente>('/utenti').valueChanges();
    else
      return this.firestore
        .collection<Utente>('/utenti', (ref) =>
          ref.where('corso', '==', this.auth.getUserData().corso)
        )
        .valueChanges();
  }

  creaUtente(
    nome: string,
    corso: string,
    email: string,
    password: string,
    ruolo: number
  ) {
    let utente: Utente = {
      corso: corso,
      nome: nome,
      ruolo: ruolo,
      email: email,
      in_colloquio: false
    };
    utente.email=utente.email.trim();
    utente.email=utente.email.toLocaleLowerCase();
    this.firestore
      .collection('/utenti')
      .doc(utente.email)
      .set(utente)
      .then(() => {
        this.authFirebase
          .createUserWithEmailAndPassword(email, password)
          .then((cred) => {
            this.authFirebase.signOut();
          });
      })
      .catch((err) => {
        window.alert(err);
      });
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

  cambiaNome(email: string, nome: string) {
    const id = this.firestore
      .collection('/utenti', (ref) => ref.where('email', '==', email))
      .get()
      .forEach((qs) =>
        qs.forEach((d) =>
          this.firestore
            .collection('/utenti')
            .doc(d.id)
            .update({ nome: nome })
            .then()
        )
      );
  }

  cambiaUrl(email: string, url: string) {
    const id = this.firestore
      .collection('/utenti', (ref) => ref.where('email', '==', email))
      .get()
      .forEach((qs) =>
        qs.forEach((d) =>
          this.firestore
            .collection('/utenti')
            .doc(d.id)
            .update({ url: url })
            .then()
        )
      );
  }

  ///////
  //GESTIONE GUIDE
  ///////

  leggiGuide(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) =>
        ref.where('corso', '==', corso).where('ruolo', 'in', [2, 4])
      )
      .valueChanges();
  }

  //////
  //GESTIONE SLOT
  //////
  cancellaSlot(slotId: string) {
    this.firestore.collection<Slots>('/agenda').doc(slotId).delete();
  }
  pulisciSlot(slotId: string) {
    this.firestore.collection<Slots>('/agenda').doc(slotId).update({occupato:""});
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

  //////
  //GESTIONE BACHECHE
  //////

  aggiungiMessaggio(utenteEmail: string, messaggio: string) {
    this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        if (u?.bacheca) {
          u.bacheca.push(messaggio);
        } else {
          u!.bacheca! = [messaggio];
        }
        this.firestore
          .collection<Utente>('/utenti')
          .doc(utenteEmail)
          .update(u!)
          .then()
          .catch();
      });
  }

  cancellaMessaggi(utenteEmail: string, msg: string) {
    this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u!.bacheca! = u!.bacheca!.filter((m) => m !== msg);
        this.firestore
          .collection<Utente>('/utenti')
          .doc(utenteEmail)
          .update(u!)
          .then()
          .catch();
      });
  }

  aggiungiMessaggioCorso(corso: string, messaggio: string) {
    this.firestore
      .collection<{ corso: string; info: string[] }>('/corsi')
      .doc(corso)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u?.info?.push(messaggio);
        this.firestore
          .collection<{ corso: string; info: string[] }>('/corsi')
          .doc(corso)
          .update(u!)
          .then()
          .catch();
      });
  }

  cancellaMessaggioCorso(corso: string, msg: string) {
    this.firestore
      .collection<{ corso: string; info: string[] }>('/corsi')
      .doc(corso)
      .valueChanges()
      .pipe(take(1))
      .subscribe((u) => {
        u!.info! = u!.info!.filter((m) => m !== msg);
        this.firestore
          .collection<{ corso: string; info: string[] }>('/corsi')
          .doc(corso)
          .update(u!)
          .then()
          .catch();
      });
  }
  //////
  //GESTIONE ALLEGATI
  //////
  aggiungiAllegato(
    corso: string,
    nomeFile: string,
    url: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection<Corso>('corsi')
        .doc(corso)
        .valueChanges()
        .pipe(take(1))
        .subscribe((c) => {
          const f: File = { nome: nomeFile, url: url };
          if (!c) reject();
          c!.allegati ? c!.allegati.push(f) : (c!.allegati = [f]);
          this.firestore
            .collection<Corso>('corsi')
            .doc(corso)
            .update(c!)
            .then(() => resolve(true))
            .catch(() => reject());
        });
    });
  }

  cancellaAllegato(corso: string, nomeFile: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection<Corso>('corsi')
        .doc(corso)
        .valueChanges()
        .pipe(take(1))
        .subscribe((c) => {
          if (!c) reject();
          c!.allegati! = c!.allegati!.filter((a) => a.nome != nomeFile);
          this.firestore
            .collection<Corso>('corsi')
            .doc(corso)
            .update(c!)
            .then(() => resolve(true))
            .catch(() => reject());
        });
    });
  }
  //////////////
  //CHAT
  //////////////
  cancellaTuttaChat(corso: string) {
    this.firestore
      .collection<{ chat: ChatMessage[] }>('chat')
      .doc(corso)
      .update({ chat: [] });
  }
}

//
