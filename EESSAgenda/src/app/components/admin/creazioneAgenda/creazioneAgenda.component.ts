import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import { Slots, Utente } from 'src/models/model'
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, } from '@angular/router';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AdminDataService } from 'src/app/services/adminData.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-creazioneAgenda',
  templateUrl: 'creazioneAgenda.component.html'
})

export class CreazioneAgendaComponent implements OnInit, OnDestroy {
  constructor(private firestore: DataService, private route:ActivatedRoute, private adminData:AdminDataService) {}
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
  listaGuide : KeyValue<string, string>[] = [];

  componentSubscriptions = new Subscription()
  ngOnInit() {
    this.componentSubscriptions.add(this.route.params.subscribe( params => {
      this.corso = params['id'];
      this.guide$ = this.adminData.leggiGuide(this.corso);
      this.lista$ = this.firestore.leggiSlot(this.corso);
    }));
    this.componentSubscriptions.add(this.adminData.leggiGuide(this.corso).subscribe( gl => {gl.forEach( g => {this.listaGuide.push({key:g.email, value:g.nome})})}));
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
  nomeGuida(email:string):string{
    let res = "";
    this.listaGuide.forEach(element => {
      if (element.key == email) {res = element.value}
    });
    return res;
  }
  conferma() {
    const fine = new Date(this.data_effettiva.getTime()+this.durata_colloquio*60000)
    console.log(this.data_effettiva)
    this.adminData.creaSlot(this.corso ,this.guida, this.data_effettiva.toISOString(), fine.toISOString());
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
    this.adminData.cancellaSlot(id);
  }

  pulisciSlot(id:string) {
    this.adminData.pulisciSlot(id);
  }


}
