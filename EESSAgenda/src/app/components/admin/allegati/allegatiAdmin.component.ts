import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { File, Utente } from 'src/models/model';

@Component({
  templateUrl: 'allegatiAdmin.component.html',
})
export class AllegatiAdminComponent implements OnInit {
  constructor(private data: DataService, private router: ActivatedRoute) {}
  componentSubscribers: Subscription = new Subscription();
  corso: string = '';
  allegati$: Observable<File[] | undefined> = new Observable<File[] | undefined>();

  ngOnInit() {
    this.corso = this.router.snapshot.params['id'];
    this.allegati$ = this.data.leggiAllegati(this.corso);
  }


  aggiugiAllegato(corso: string, nomeFile: string, url:string) {
    this.data.aggiungiAllegato(corso, nomeFile, url);

  }

  cancellaAllegato(corso: string, nomeFile: string) {
    this.data.cancellaAllegato(corso, nomeFile);
  }

}
