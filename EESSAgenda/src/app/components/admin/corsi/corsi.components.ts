import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Corso } from 'src/models/model';

@Component({
  template: `<input #corso /> <button (click)="creaCorso(corso)">OK</button>
    <li *ngFor="let corso of lista$ | async">
      <ul>
        <a [routerLink]="['/admin', 'creazioneAgenda', corso.corso]">{{
          corso.corso
        }}</a>
        <button mat-icon-button [routerLink]="['/admin', 'messaggi', corso.corso]"><mat-icon>assignment</mat-icon></button>
        <button mat-icon-button (click)="cancellaCorso(corso.corso)">
          <mat-icon>delete</mat-icon>
        </button>
      </ul>
    </li>`,
})
export class CorsiComponent implements OnInit {
  constructor(private firestore: DataService) {}

  lista$: Observable<Corso[]> = new Observable<Corso[]>();

  ngOnInit(): void {
    this.lista$ = this.firestore.leggiCorsi();
  }

  creaCorso(corso: HTMLInputElement) {
    if (corso.value !== '') this.firestore.creaCorso(corso.value);
  }

  cancellaCorso(corso: string) {
    console.log(corso);
    this.firestore.cancellaCorso(corso);
  }
}
