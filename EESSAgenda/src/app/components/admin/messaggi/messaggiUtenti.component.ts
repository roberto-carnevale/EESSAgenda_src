import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AdminDataService } from 'src/app/services/adminData.service';
import { DataService } from 'src/app/services/data.service';
import { Utente } from 'src/models/model';

@Component({
  templateUrl: 'messaggi.component.html',
})
export class MessaggiUtentiComponent implements OnInit, OnDestroy {
  constructor(private data: DataService, private router: ActivatedRoute, private adminData:AdminDataService) {}
  componentSubscribers: Subscription = new Subscription();
  corso: string = '';
  utentiCorso$: Observable<Utente[]> = new Observable<Utente[]>();
  bacheca_corso$: Observable<string[] | undefined> = new Observable<
    string[] | undefined
  >();
  @ViewChild('in') inInput:any;

  ngOnInit() {
    this.corso = this.router.snapshot.params['id'];
    this.utentiCorso$ = this.data.leggiUtentiCorso(this.corso);
    this.bacheca_corso$ = this.data.leggiBachecaCorso(this.corso);
  }

  ngOnDestroy(): void {
    this.componentSubscribers.unsubscribe();
  }

  aggiugiBacheca(utenteEmail: string, messaggio: string) {
    this.inInput.nativeElement.value="";
    this.adminData.aggiungiMessaggio(utenteEmail, messaggio);
  }

  aggiugiBachecaCorso(corso: string, messaggio: string) {
    this.inInput.nativeElement.value="";
    this.adminData.aggiungiMessaggioCorso(corso, messaggio);
  }

  cancellaMessaggio(utenteEmail: string, msg:string) {
    this.adminData.cancellaMessaggi(utenteEmail, msg);
  }

  cancellaMessaggioCorso(msg: string) {
    this.adminData.cancellaMessaggioCorso(this.corso, msg);
  }

}
