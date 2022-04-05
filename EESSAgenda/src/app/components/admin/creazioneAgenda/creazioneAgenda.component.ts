import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, Timestamp } from 'rxjs';
import { Corso, Slots, Utente } from 'src/models/model'
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { tap } from 'rxjs/operators'


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
  //data = new Date();
  guide$ = new Observable<Utente[]>();
  guida = "";
  lista$ = new Observable<Slots[]>();
  data_effettiva = new Date(new Date().setHours(9,0,0,0));
  durata_colloquio = 15;

  componentSubscriptions = new Subscription()
  ngOnInit() {
    this.componentSubscriptions.add(this.route.params.subscribe( params => {
      this.corso = params['id'];
      this.guide$ = this.firestore.leggiGuide(this.corso);
      this.lista$ = this.firestore.leggiSlot(this.corso);
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
    this.durata_colloquio = Number.parseInt(durata.value);
    this.controlla();
  }

  controlloData(picker:MatDatepickerInputEvent<any, any>) {
    this.data_effettiva = picker.value;
    this.controlla();
  }

  controlloGuida(evento:unknown) {
    this.guida = evento as string;
    this.controlla();
  }

  conferma() {
    const fine = new Date(this.data_effettiva.getTime()+this.durata_colloquio*60000)
    console.log(this.data_effettiva)
    this.firestore.creaSlot(this.corso ,this.guida, this.data_effettiva.toISOString(), fine.toISOString());
    this.data_effettiva = fine;
  }

  controlla() {
    console.log(this.ore, this.minuti, this.data_effettiva);
    if ( this.ore >= 0 && this.ore < 23 && this.minuti>=0 && this.minuti < 59 && this.data_effettiva.setHours(this.ore, this.minuti,0,0) > new Date().getTime() && this.guida !== "") {this.inibito = false} else {this.inibito=true}
  }

  tasnformData(l: Slots):Slots {
    return l;
  }

  cancellaSlot(id:string) {
    this.firestore.cancellaSlot(id);
  }


}
