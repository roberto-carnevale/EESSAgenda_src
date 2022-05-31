import { Injectable } from '@angular/core';
import { Corso, TipoUtente, Utente } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public changedAuth = new Subject<boolean>();
  public guardedPath: string | null = '/';
  private utente: Utente = {
    corso: '',
    nome: '',
    ruolo: TipoUtente.Esercitante,
    email: '',
  };
  private isAuth: boolean = false;
  private email: string = '';
  subscribeUserChanges = new Subject<Utente>();

  constructor(
    private authFirebase: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.authFirebase.setPersistence('local').then(() => {
      this.authFirebase.currentUser.then((user) => {
        if (user) {
          this.isAuth = true;
          this.email = user?.email!;
          this.retrieveUserData().then((u) => {
            this.utente = u;
            this.changedAuth.next(this.isAuth);
            this.router.navigate([this.guardedPath]);
          });
        }
      });
    });
  }

  setUser(user: { email: string; password: string } | null): void {
    if (user) {
      user.email = user.email.trim();
      user.email = user.email.toLocaleLowerCase();
      this.authFirebase.setPersistence('local').then(() => {
        this.authFirebase
          .signInWithEmailAndPassword(user.email, user.password)
          .then((userCredential) => {
            this.email = userCredential.user?.email!;
            this.retrieveUserData().then((u) => {
              this.utente = u;
              this.isAuth = true;
              // Signed in
              localStorage.setItem('userId', userCredential.user!.email!);
              if (this.guardedPath) {
                this.router.navigate([this.guardedPath]);
                this.guardedPath = null;
              } else {
                this.router.navigate(['/']);
              }
              this.changedAuth.next(this.isAuth);
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorMessage);
            this.isAuth = false;
            this.changedAuth.next(this.isAuth);
          });
      });
    } else {
      this.authFirebase
        .signOut()
        .then(() => {
          this.isAuth = false;
          this.guardedPath = null;
          this.utente.email = '';
          this.utente.corso = '';
          this.utente.url = '';
          this.utente.ruolo = TipoUtente.Esercitante;
          this.changedAuth.next(this.isAuth);
        })
        .catch((error) => {});
    }
  }
  subscribeAuth(): Observable<boolean> {
    return this.changedAuth.asObservable();
  }

  getUserId(): string {
    return this.utente.email;
  }

  private retrieveUserData(): Promise<Utente> {
    return new Promise<Utente>((resolve, reject) => {
      this.firestore
        .collection<Utente>('utenti')
        .doc(this.email)
        .get()
        .forEach((qs) => {
          resolve({ ...(qs.data() as Utente) });
        })
        .catch((err) => {
          window.alert(err);
          reject(err);
        });
    });
  }

  updateOnUserData(): Observable<Utente | undefined> {
    return this.firestore
      .collection<Utente>('utenti')
      .doc(this.email)
      .valueChanges();
  }

  getUserData(): Utente {
    return this.utente;
  }

  resetUser(email: string): void {
    this.authFirebase.sendPasswordResetEmail(email);
  }

  trovaCorsoConChiave(chiave: string): Promise<string | null> {
    return new Promise<string>((resolve, reject) => {
      return this.firestore
        .collection<Corso>('signinkey', (ref) =>
          ref.where('chiave', '==', chiave)
        )
        .valueChanges()
        .pipe(
          take(1),
          map((cc) => {
            if (cc[0]) {
              return cc[0].corso;
            } else {
              return null;
            }
          })
        )
        .subscribe((nomeCorso) => {
          if (nomeCorso) {
            resolve(nomeCorso);
          } else {
            reject(null);
          }
        });
    });
  }

  ////////////////////////
  //SELF-SERVICE - SIGIN//
  ////////////////////////
  /*
  1. Se già autenticato e appartenente allo stesso corso=> manda alla home || cambia corso
  2. Se l'utente non esiste lo crea
  3. Controllare che l'utente si autentichi e sia del corso in singin => Autenticato
  4. Se l'utente esite propone cambio pwd => Attiva bottone
  5. Se si sta registrando ad un'altro corso => Autenticato
  */

  controllaPreSignIn(corso: string) {
    this.authFirebase.currentUser
      .then((u) => {
        if (u) {
          this.retrieveUserData().then((utente) => {
            if (utente.corso != corso) {
              //se il corso è diverso lo cambio
              utente.corso = corso;
              this.firestore
                .collection('/utenti')
                .doc(utente.email)
                .update({ corso: corso })
                .then(() => {
                  this.sendToHome(utente);
                });
            }
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  creaEsercitanteDaLink(
    nome: string,
    corso: string,
    email: string,
    password: string,
    key: string
  ): Promise<number> {
    let utente: Utente = {
      corso: corso,
      nome: nome,
      ruolo: TipoUtente.Esercitante,
      email: email,
    };
    ////NUOVA PROCEDURE
    return new Promise<number>((resolve, reject) => {
      //cerca l'utente ( ***PASSO 2.***)
      this.authFirebase.fetchSignInMethodsForEmail(email).then((r) => {
        console.log(r);
        if (r.length == 0) {
          //non trova un utente e lo crea
          this.authFirebase
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              utente.corso = corso;
              //scrive nel DB i dati utente
              this.firestore
                .collection('/utenti')
                .doc(utente.email)
                .set(utente)
                .then(() => {
                  //autenticato internamente e indirizzato alla home

                  this.sendToHome(utente);
                  resolve(0);
                });
            });
        } else {
          /// trova l'utente e cerca di autenticarlo con la prima password
          let user = { email: email, password: password };
          //prova ad autenticare
          this.authFirebase.setPersistence('local').then(() => {
            this.authFirebase
              .signInWithEmailAndPassword(user.email, user.password)
              .then(() => {
                // è autenticato
                this.email = email;
                this.retrieveUserData().then((u) => {
                  if (u.corso != corso) {
                    u.corso = corso;
                    //se il corso è diverso lo cambio
                    this.firestore
                      .collection('/utenti')
                      .doc(utente.email)
                      .update({ corso: corso })
                      .then(() => {
                        //spedisce alla home e imposta l'utente
                        this.sendToHome(u);
                        resolve(0);
                      });
                  }
                });
              })
              .catch((error) => {
                //password errata o errore generico
                resolve(1);
              });
          });
        }
      });
      resolve(-1);
    });
  }

  sendToHome(u: Utente) {
    this.utente = u;
    this.isAuth = true;
    // Autenticato e reindirizzato alla home
    localStorage.setItem('userId', u.email);
    setTimeout(() => {
      this.router.navigate(['/']);
      this.changedAuth.next(this.isAuth);
    }, 300);
  }
}
