import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { TipoUtente, Utente } from 'src/models/model';

@Component({
  templateUrl: 'guida.component.html'
})

export class GuidaComponent implements OnInit {
  @ViewChild('fab_icon') fab_icon!:any;
  in_colloquio = false;
  componemntSubcriptions = new Subscription();
  utente : Utente = {corso:"", email:"", nome: "", ruolo: TipoUtente.Guida, uid:'', url:'',in_colloquio:false, id:''};
  agendaGuida$ : Observable<{ora:string, esercitante:string}[]> = new Observable<{ora:string, esercitante:string}[]>();
  constructor(private auth: AuthService, private data: DataService) { }


  ngOnInit() {
    this.componemntSubcriptions = this.auth.subscribeAuth().subscribe(
      (isLoggedIn) => {
        if (isLoggedIn)  {
          this.utente = this.auth.getUserData();
          this.agendaGuida$ = this.data.leggiAgendaGuida(this.utente);
        }
      }
    )
  }

  switch() {
    this.in_colloquio = !this.in_colloquio;
    this.in_colloquio?
    this.fab_icon._elementRef.nativeElement.textContent = "airline_seat_recline_normal":
    this.fab_icon._elementRef.nativeElement.textContent = "chair";
    this.utente.in_colloquio= this.in_colloquio;
    console.log(this.utente)
    this.data.cambiaStato(this.utente);
  }

  libero(s:string):any {
    if (s == "") return {"background-color":"lightgreen"}
  }
}
