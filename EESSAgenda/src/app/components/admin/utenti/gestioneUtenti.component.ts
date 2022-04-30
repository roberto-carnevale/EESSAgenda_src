import { Component, OnInit} from '@angular/core';
import { Utente,  TipoUtente, Corso} from 'src/models/model';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/services/auth.service';
import { AdminDataService } from 'src/app/services/adminData.service';


@Component({
  selector: 'app-gestioneUtenti',
  templateUrl: 'gestioneUtenti.component.html'
})

export class GestioneUtentiComponent implements OnInit {
  constructor(private dataService:DataService, private auth:AuthService, private adminData:AdminDataService) { }
  utenti$ = new Observable<Utente[]>();
  listaRuoliConst : {id:number, val:string}[] = [];
  listaRuoliSelect : {id:number, val:string}[] = [];
  corsi$ = new Observable<Corso[]>();

  ngOnInit() {
    this.utenti$ = this.adminData.leggiUtenti();
    this.corsi$ = this.adminData.leggiCorsi();
    this.listaRuoliConst = this.listaRuoli();
    this.listaRuoliSelect = this.listaRuoliRoll();
  }

  newUser(nome: HTMLInputElement, email: HTMLInputElement, ruolo: MatSelect, corso:MatSelect):void{
      this.adminData.creaUtente(nome.value, corso.value, email.value, "th1s1sAqu1teStr0ng!!", ruolo.value);
  }

  listaRuoli():{id:number, val:string}[]{
    const res =[
      {id:0, val:"Amministratore"},
      {id:1, val:"Esercitante"},
      {id:2, val:"Guida"},
      {id:3, val:"Gestore"},
      {id:4, val:"GuidaSmart"}
    ]
    return res;
  }

  listaRuoliRoll():{id:number, val:string}[]{
    const res =[
      {id:1, val:"Esercitante"},
      {id:2, val:"Guida"},
      {id:3, val:"Gestore"},
      {id:4, val:"GuidaSmart"}
    ]
    return res;
  }

  cambioCorso(email:string, corso:string) {
    console.log(email);
    console.log(corso);
    this.adminData.cambiaCorso(email, corso);
  }
  resetPassword(email:string):void {
    this.auth.resetUser(email);
  }
}



/* export interface Utente {
  uid: string,
  nome : string,
  ruolo : TipoUtenti,
  corso: string,
  email: string
}
 */
