import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Corso } from 'src/models/model';

@Component({
  template:`
  <span *ngIf="ruolo == 0"><input #corso/> <button (click)="creaCorso(corso)">OK</button></span>
  <div style="padding-left: 2rem">
    <ng-container *ngFor="let corso of lista$ | async">
        {{corso.corso}}
        <button mat-icon-button [routerLink]="['/admin', 'creazioneAgenda', corso.corso]"><mat-icon>edit_calendar</mat-icon></button>
        <button mat-icon-button [routerLink]="['/admin', 'home', corso.corso]"><mat-icon>home</mat-icon></button>
        <button mat-icon-button [routerLink]="['/admin', 'messaggi', corso.corso]"><mat-icon>assignment</mat-icon></button>
        <button mat-icon-button [routerLink]="['/admin', 'allegati', corso.corso]"><mat-icon>cloud_circle</mat-icon></button>
        <button mat-icon-button (click)="copiaURL(corso.corso);"><mat-icon>link</mat-icon></button>
        <button mat-icon-button (click)="cancellaCorso(corso.corso)">
          <mat-icon>delete</mat-icon>
        </button>
      <hr/>
    </ng-container>
  </div>
  `
})
export class CorsiComponent implements OnInit {
  constructor(private auth: AuthService, private firestore: DataService, private _snackbar:MatSnackBar) {}

  lista$: Observable<Corso[]> = new Observable<Corso[]>();
  ruolo: number = 3;

  ngOnInit(): void {
    this.ruolo = this.auth.getUserData().ruolo;
    this.lista$ = this.firestore.leggiCorsi();
  }

  creaCorso(corso: HTMLInputElement) {
    if (corso.value !== '') this.firestore.creaCorso(corso.value);
  }

  cancellaCorso(corso: string) {
    this.firestore.cancellaCorso(corso);
  }

  copiaURL(corso: string) {
    this.firestore.leggiSignInURL(corso).then( s => {
      console.log(s)
      if (s) navigator.clipboard.writeText(s).then( () => { this._snackbar.open("Indirizzo di registrazione copiato"); setTimeout(() => {
        this._snackbar.dismiss();
      }, 3000);});
    }).catch(() => {console.error("Indirizzo non costruito")});

  }
}
