import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Corso } from 'src/models/model'
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-creazioneAgenda',
  templateUrl: 'creazioneAgenda.component.html'
})

export class CreazioneAgendaComponent implements OnInit, OnDestroy {
  constructor(private firestore: DataService, private route:ActivatedRoute) { }
  corso = "";

  componentSubscriptions = new Subscription()
  ngOnInit() {
    this.componentSubscriptions.add(this.route.params.subscribe( params => {
      this.corso = params['id'];
    }));
  }
  ngOnDestroy(): void {
    this.componentSubscriptions.unsubscribe();
  }
}
