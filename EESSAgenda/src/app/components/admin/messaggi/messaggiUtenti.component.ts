import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Utente } from 'src/models/model';

@Component({
  templateUrl: 'messaggi.component.html'
})
export class MessaggiUtentiComponent implements OnInit, OnDestroy {
  constructor(private data:DataService, private router:ActivatedRoute) { }
  componentSubscribers : Subscription = new Subscription();
  corso : string = "";
  utentiCorso$ : Observable<Utente[]> = new Observable<Utente[]>();

  ngOnInit() {

        this.corso = this.router.snapshot.params['id'];
        this.utentiCorso$ = this.data.leggiUtentiCorso(this.corso);

  }

  ngOnDestroy(): void {
    this.componentSubscribers.unsubscribe();
  }

  aggiugiBachecca(utenteId: string, messaggio:string) {
    this.data.aggiungiMessaggio(utenteId,messaggio);
  }

  ripulisciBacheca(utenteId: string) {

  }
}



