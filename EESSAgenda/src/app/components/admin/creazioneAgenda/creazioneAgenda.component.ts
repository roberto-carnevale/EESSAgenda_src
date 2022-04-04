import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Corso, Slots, Utente } from 'src/models/model'
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-creazioneAgenda',
  templateUrl: 'creazioneAgenda.component.html'
})

export class CreazioneAgendaComponent implements OnInit, OnDestroy {
  constructor(private firestore: DataService, private route:ActivatedRoute) {}
  corso = "";
  inibito = true;
  ore = 9;
  minuti = 0;
  data = new Date();
  guide$ = new Observable<Utente[]>();
  guida = "";
  lista = new Observable<Slots[]>();

  componentSubscriptions = new Subscription()
  ngOnInit() {
    this.componentSubscriptions.add(this.route.params.subscribe( params => {
      this.corso = params['id'];
      this.guide$ = this.firestore.leggiGuide(this.corso);
    }));

  }


  ngOnDestroy(): void {
    this.componentSubscriptions.unsubscribe();
  }

  controlloOre(ore:HTMLInputElement) {
    this.ore = Number.parseInt(ore.value);
    this.controlla();
  }

  controlloMinuti(minuti:HTMLInputElement) {
    this.minuti = Number.parseInt(minuti.value);
    this.controlla();
  }
  controlloDurata(durata:HTMLInputElement) {
    this.minuti = Number.parseInt(durata.value);
    this.controlla();
  }

  controlloData(picker:MatDatepickerInputEvent<any, any>) {
    this.data = picker.value;
    this.controlla();
  }
  controlloGuida(evento:MatSelectChange) {
    this.guida = evento.value;
    this.controlla();
  }

  conferma() {
    this.firestore.creaSlot("guida", new Date(), new Date());
  }

  controlla() {
    console.log(this.ore, this.minuti, this.data);
    if ( this.ore >= 0 && this.ore < 23 && this.minuti>=0 && this.minuti < 59 && this.data.setHours(this.ore, this.minuti,0,0) > new Date().getTime() && this.guida !== "") {this.inibito = false} else {this.inibito=true}
  }


}
