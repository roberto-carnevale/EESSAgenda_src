import { Injectable } from '@angular/core';
import { TipoUtente, Utente } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public changedAuth = new Subject<boolean>();
  public guardedPath: string | null;
  private utente: Utente = {
    uid: '',
    corso: '',
    nome: '',
    ruolo: TipoUtente.Esercitante,
    email: '',
    id: '',
  };
  private isAuth: boolean = false;
  private uid: string = '';
  subscribeUserChanges = new Subject<Utente>()

  constructor(
    private authFirebase: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.authFirebase.setPersistence('local').then(() => {
      this.authFirebase.currentUser.then((user) => {
        if (user) {
          this.isAuth = true;
          this.uid = user?.uid;
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
            this.uid = userCredential.user?.uid!;
            this.retrieveUserData().then((u) => {
              this.utente = u;
            });
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
          this.changedAuth.next(this.isAuth);
          this.guardedPath = null;
          this.utente.uid = '';
          this.utente.email = '';
          this.utente.corso = '';
          this.utente.url = '';
          this.utente.ruolo = TipoUtente.Esercitante;
        })
        .catch((error) => {});
    }
  }
  subscribeAuth(): Observable<boolean> {
    return this.changedAuth.asObservable();
  }

  getUserId(): string {
    return this.utente.uid;
  }

  private retrieveUserData(): Promise<Utente> {
    return new Promise<Utente>((resolve) => {
      this.firestore
        .collection('utenti', (ref) => ref.where('uid', '==', this.uid))
        .get()
        .forEach((qs) => {
          resolve({ ...(qs.docs[0].data() as Utente), id: qs.docs[0].id });
        });
    });
  }

  updateOnUserData(): Observable<Utente[]> {
      return this.firestore
        .collection<Utente>('utenti', (ref) => ref.where('uid', '==', this.uid)).valueChanges({ idField: 'id'});
  }

  getUserData(): Utente {
    return this.utente;
  }

  resetUser(email: string): void {
    this.authFirebase.sendPasswordResetEmail(email);
  }
}
