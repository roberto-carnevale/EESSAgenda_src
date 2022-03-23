import { Injectable } from '@angular/core';
import { Slots, Agenda, Corso, Utente } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  public changedAuth = new Subject<boolean>();
  public guardedPath: string | null;
  private utente: Utente = { uid: '', corso: '', nome: '', ruolo: false };
  private isAuth: boolean = false;

  constructor(
    private authFirebase: AngularFireAuth,
    private router: Router,
    firestore: AngularFirestore
  ) {
    this.authFirebase.setPersistence('local').then(() => {
      this.authFirebase.currentUser.then((user) => {
        if (user) {
          this.isAuth = true;
          this.utente.uid = user?.uid;
        }
        this.changedAuth.next(this.isAuth);
      });
    });
    this.guardedPath = null;
  }

  setUser(user: AuthData | null): void {
    if (user) {
      this.authFirebase.setPersistence('local').then(() => {
        this.authFirebase
          .signInWithEmailAndPassword(user.email, user.password)
          .then((userCredential) => {
            this.isAuth = true;
            // Signed in
            localStorage.setItem('userId', userCredential.user!.providerId!);
            this.changedAuth.next(this.isAuth);
            this.utente.uid = userCredential.user?.uid!;
            if (this.guardedPath) {
              this.router.navigate([this.guardedPath]);
              this.guardedPath = null;
            } else {
              this.router.navigate(['/']);
            }
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
        })
        .catch((error) => {});
    }
  }
  subscribeAuth(): Observable<boolean> {
    return this.changedAuth.asObservable();
  }

  getUserId(): string | undefined {
    return this.utente.uid;
  }
}
