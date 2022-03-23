import { Injectable } from '@angular/core';
import { Slots, Agenda, Corso, Utente } from 'src/models/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
    public changedAuth = new Subject<boolean>();
    private utente: Utente = { uid: "", corso:"", nome:"", ruolo:false};
    private isAuth: boolean = false;

    
    constructor(private authFirebase: AngularFireAuth, private router: Router, firestore: AngularFirestore) {
    }
    
}