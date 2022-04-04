import { Component, OnInit } from '@angular/core';
import { Utente } from 'src/models/model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-gestioneUtenti',
  templateUrl: 'gestioneUtenti.component.html'
})

export class GestioneUtentiComponent implements OnInit {
  constructor(private dataService:DataService) { }

  ngOnInit() {

  }

  newUser():void{
    
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
