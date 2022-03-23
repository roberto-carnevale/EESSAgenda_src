import { Injectable } from '@angular/core';
import { Slots, Agenda, Corso, Utente } from 'src/models/model';

@Injectable({providedIn: 'root'})
export class DataService {
    constructor() { }

    utente : Utente = {corso:"", nome: "", ruolo:false};
    
    
}