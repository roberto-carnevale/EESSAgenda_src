import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Corso } from 'src/models/model'
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';


@Component({
  selector: 'app-creazioneAgenda',
  templateUrl: 'creazioneAgenda.component.html'
})

export class CreazioneAgendaComponent implements OnInit, OnDestroy {
  constructor(private firestore: DataService, private route:ActivatedRoute) { }
  corso = "";
  inibito = true;
  ore = 9;
  minuti = 0;
  data = new Date();

  componentSubscriptions = new Subscription()
  ngOnInit() {
    this.componentSubscriptions.add(this.route.params.subscribe( params => {
      this.corso = params['id'];
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

  controlloData(picker:MatDatepickerInputEvent<any, any>) {
    this.data = picker.value;
    this.controlla();
  }

  conferma() {

  }

  controlla() {
    console.log(this.ore, this.minuti, this.data);
    if ( this.ore >= 0 && this.ore < 23 && this.minuti>=0 && this.minuti < 59 && this.data.getTime() > new Date().setHours(0,0,0,0) ) {this.inibito = false} else {this.inibito=true}
  }


}
