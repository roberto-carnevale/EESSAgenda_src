import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Utente } from 'src/models/model';

@Component({
  templateUrl: 'messaggi.component.html',
})
export class MessaggiUtentiComponent implements OnInit, OnDestroy {
  constructor(private data: DataService, private router: ActivatedRoute) {}
  componentSubscribers: Subscription = new Subscription();
  corso: string = '';
  utentiCorso$: Observable<Utente[]> = new Observable<Utente[]>();
  bacheca_corso$: Observable<string[] | undefined> = new Observable<
    string[] | undefined
  >();

  ngOnInit() {
    this.corso = this.router.snapshot.params['id'];
    this.utentiCorso$ = this.data.leggiUtentiCorso(this.corso);
    this.bacheca_corso$ = this.data.leggiBachecaCorso(this.corso);
  }

  ngOnDestroy(): void {
    this.componentSubscribers.unsubscribe();
  }

  aggiugiBacheca(utenteEmail: string, messaggio: string) {
    this.data.aggiungiMessaggio(utenteEmail, messaggio);
  }

  aggiugiBachecaCorso(corso: string, messaggio: string) {
    this.data.aggiungiMessaggioCorso(corso, messaggio);
  }

  ripulisciBacheca(utenteEmail: string) {
    this.data.cancellaMessaggi(utenteEmail);
  }

  cancellaMessaggioCorso(msg: string) {
    this.data.cancellaMessaggioCorso(this.corso, msg);
  }

}
