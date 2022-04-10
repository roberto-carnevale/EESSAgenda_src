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

  ngOnInit() {
    if (this.authService.getUserId() !== '') {
      this.preparaDati(this.authService.getUserData());
      this.subscription_componenet.add(this.authService.updateOnUserData().subscribe( u => {this.preparaDati(u[0])}));
    } else {
        this.subscription_componenet.add(
          this.authService.subscribeAuth().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.preparaDati(this.authService.getUserData());
              this.subscription_componenet.add(this.authService.updateOnUserData().subscribe( u => {this.preparaDati(u[0])}));
            }
          })
        );
    }
   }

   preparaDati(utente: Utente){
     if (utente.bacheca) this.bachecaPersonale = utente.bacheca;
   }


}
