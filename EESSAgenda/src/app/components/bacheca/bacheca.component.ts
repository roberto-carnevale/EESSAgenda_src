import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Utente } from 'src/models/model';

@Component({
  templateUrl: 'bacheca.component.html'
})

export class BachecaComponent implements OnInit {
  constructor(private dataService: DataService, private authService:AuthService) { }
  subscription_componenet:Subscription= new Subscription();
  bachecaPersonale : string[] = [];
  bacheca_corso$ : Observable<string[][]> | undefined = undefined;
  corso:string = "";

  ngOnInit() {
    if (this.authService.getUserId() !== '') {
      this.preparaBachecaPersonale(this.authService.getUserData());
      this.subscription_componenet.add(this.authService.updateOnUserData().subscribe( u => {
        this.preparaBachecaPersonale(u[0]);
        if (!this.bacheca_corso$){ this.bacheca_corso$ = this.dataService.leggiBachecaCorso(u[0].corso)};
      }));
    } else {
        this.subscription_componenet.add(
          this.authService.subscribeAuth().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.preparaBachecaPersonale(this.authService.getUserData());
              this.subscription_componenet.add(this.authService.updateOnUserData().subscribe( u => {this.preparaBachecaPersonale(u[0])}));
            }
          })
        );
    }
   }

   preparaBachecaPersonale(utente: Utente){
    //aggiornamento bacheca personale
    utente.bacheca?this.bachecaPersonale = utente.bacheca:this.bachecaPersonale=[];
    this.corso=utente.corso;
   }


}
