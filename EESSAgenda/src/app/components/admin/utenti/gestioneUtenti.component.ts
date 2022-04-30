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
  corsi$ = new Observable<Corso[]>();

  ngOnInit() {
    this.utenti$ = this.adminData.leggiUtenti();
    this.corsi$ = this.adminData.leggiCorsi();
    this.listaRuoliConst = this.listaRuoli();
  }

  newUser(nome: HTMLInputElement, email: HTMLInputElement, ruolo: MatSelect, corso:MatSelect):void{
    if (ruolo.value == TipoUtente.Esercitante)
      this.adminData.creaEsercitante(nome.value, corso.value, email.value, "th1s1sAqu1teStr0ng!!");
    if (ruolo.value == TipoUtente.Guida)
      this.adminData.creaGuida(nome.value, corso.value, email.value, "th1s1sAqu1teStr0ng!!");
    if (ruolo.value == TipoUtente.Gestore)
      this.adminData.creaGestore(nome.value, corso.value, email.value, "th1s1sAqu1teStr0ng!!");
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
