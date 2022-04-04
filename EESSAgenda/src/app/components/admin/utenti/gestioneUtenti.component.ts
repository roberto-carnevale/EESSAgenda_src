import { Component, OnInit} from '@angular/core';
import { Utente,  TipoUtente, Corso} from 'src/models/model';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-gestioneUtenti',
  templateUrl: 'gestioneUtenti.component.html'
})

export class GestioneUtentiComponent implements OnInit {
  constructor(private dataService:DataService) { }
  utenti$ = new Observable<Utente[]>();
  listaRuoliConst : {id:number, val:string}[] = [];
  corsi$ = new Observable<Corso[]>();

  ngOnInit() {
    this.utenti$ = this.dataService.leggiUtenti();
    this.corsi$ = this.dataService.leggiCorsi();
    this.listaRuoliConst = this.listaRuoli();
  }

  newUser(nome: HTMLInputElement, email: HTMLInputElement, ruolo: MatSelect, corso:MatSelect):void{
    if (ruolo.value == TipoUtente.Esercitante)
      this.dataService.creaEsercitante(nome.value, corso.value, email.value, "th1s1sAqu1teStr0ng!!");
  }

  listaRuoli():{id:number, val:string}[]{
    const p = Object.keys(TipoUtente);
    const half = p.length/2;
    let res = []
    for (let i = 0; i<p.length/2; i++) {
      res.push({ id:Number.parseInt(p[i]),  val:p[i+half]});
    }
    return res;
  }

  cambioCorso(email:string, corso:string) {
    console.log(email);
    console.log(corso);
    this.dataService.cambiaCorso(email, corso);
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
