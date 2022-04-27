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
  public guardedPath: string | null;
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
          });
        }
      });
    });
    this.guardedPath = null;
  }

  setUser(user: { email: string; password: string } | null): void {
    if (user) {
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
    return new Promise<Utente>((resolve) => {
      this.firestore
        .collection<Utente>('utenti')
        .doc(this.email)
        .get()
        .forEach((qs) => {
          resolve({ ...(qs.data() as Utente) });
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

  trovaCorsoConChiave(chiave: string):Promise<string|null> {
    return new Promise<string>((resolve, reject) => {
      return this.firestore
        .collection<Corso>(
          'corsi',
          (ref) => ref.where('chiave', '==', chiave)
        )
        .valueChanges()
        .pipe(
          take(1),
          map((cc) => { if (cc[0]) {return cc[0].corso} else { return null;}})
        )
        .subscribe( (nomeCorso) => { if (nomeCorso) {resolve(nomeCorso)} else {reject(null)}});
    });
  }
}
