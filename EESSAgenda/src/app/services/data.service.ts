import { Injectable } from '@angular/core';
import { Slots, Utente, TipoUtente, Corso, File } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
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

  creaCorso(nome: string) {
    this.firestore
      .collection('corsi')
      .doc(nome)
      .set({ corso: nome, info: [], chiave: this.generaStringCasuale(50) })
      .then()
      .catch();
  }

  leggiSignInURL(corso: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let urlReturn =
        window.location.protocol + '//' + window.location.host + '/signin/';
      this.firestore
        .collection<Corso>('corsi')
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

  cancellaCorso(corso: string) {
    this.firestore.collection('corsi').doc(corso).delete().then().catch();
  }

  leggiCorsi(): Observable<Corso[]> {
    if (this.auth.getUserData().ruolo == TipoUtente.Amministratore)
      return this.firestore.collection<Corso>('/corsi').valueChanges();
    else
      return this.firestore.collection<Corso>('/corsi', ref => ref.where('corso', '==', this.auth.getUserData().corso)).valueChanges();
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

  leggiAllegati(corso: string): Observable<File[] | undefined> {
    return this.firestore
      .collection<Corso>('corsi')
      .doc(corso)
      .valueChanges()
      .pipe(map((c) => c?.allegati));
  }

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

  cancellaAllegato(
    corso: string,
    nomeFile: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection<Corso>('corsi')
        .doc(corso)
        .valueChanges()
        .pipe(take(1))
        .subscribe((c) => {
          if (!c) reject();
          c!.allegati! = c!.allegati!.filter ( a => a.nome != nomeFile)
          this.firestore
            .collection<Corso>('corsi')
            .doc(corso)
            .update(c!)
            .then(() => resolve(true))
            .catch(() => reject());
        });
    });
  }
}
