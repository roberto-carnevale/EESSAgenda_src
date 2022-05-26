import { Injectable } from '@angular/core';
import { Slots, Utente, TipoUtente, Corso, File, ChatMessage } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { map, take, catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}
  ///////////
  // UTENTI
  ///////////

  cercaUtente(utenteEmail: string): Observable<Utente | undefined> {
    return this.firestore
      .collection<Utente>('/utenti')
      .doc(utenteEmail)
      .valueChanges();
  }

  leggiUtentiCorso(corso: string): Observable<Utente[]> {
    return this.firestore
      .collection<Utente>('/utenti', (ref) => ref.where('corso', '==', corso))
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
  leggiCorso(corso: string): Observable<Corso | undefined> {
    return this.firestore
      .collection<Corso>('corsi')
      .doc(corso)
      .valueChanges();
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

  urlGuida(email: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      return this.firestore
        .collection<Utente>('/utenti')
        .doc(email)
        .valueChanges()
        .pipe(
          take(1),
          map((lu) => {
            return lu!.url;
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
    password: string,
    key: string
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
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 5000);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        const errorstring: string = err.toLocaleString();
        console.log(errorstring);
        this.auth.setUser({ email: email, password: password });
        this.auth.subscribeAuth().pipe(take(1)).subscribe((isAuth) => {
          if (isAuth) {
            this.firestore
              .collection<Utente>('utenti')
              .doc(email)
              .update({ corso: corso });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000);
          } else {
            this.router.navigate(['/cambio', key]);
          }
        });
      });
  }
  cambiaCorsoSelfService(corso: string, email: string, password: string) {
    this.auth.setUser({ email: email, password: password });
    const sub = this.auth.subscribeAuth().pipe(take(1)).subscribe((isAuth) => {
      if (isAuth) {
        this.firestore
          .collection<Utente>('utenti')
          .doc(email)
          .update({ corso: corso });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      } else {
        window.alert('Errore di autenticazione');
      }
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
  ///////
  //CHAT
  ///////
  leggiChat(corso : string) : Observable<ChatMessage[] | undefined>{
    return this.firestore
    .collection<{chat: ChatMessage[]}>('chat')
    .doc(corso)
    .valueChanges().pipe( map (c => c?.chat!))
  }

  mandaChat(corso : string, msgObj :ChatMessage){
    this.firestore
    .collection<{chat: ChatMessage[]}>('chat')
    .doc(corso)
    .valueChanges().pipe( take(1) ).subscribe( c => {
      c?.chat.unshift(msgObj);
      this.firestore
        .collection<{chat: ChatMessage[]}>('chat')
        .doc(corso)
        .update(c!)
    })

  }
}
