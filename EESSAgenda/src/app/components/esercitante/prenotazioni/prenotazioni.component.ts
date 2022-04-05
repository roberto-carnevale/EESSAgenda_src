import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Slots } from 'src/models/model';

@Component({
  selector: 'app-prenotazioni-name',
  templateUrl: 'prenotazioni.component.html',
})
export class PrenotazioniComponent implements OnInit {
  constructor(private dataService: DataService, private authService:AuthService) {}
  slots$ = new Observable<Slots[]>();
  subscription_componenet = new Subscription();

  ngOnInit() {
   this.subscription_componenet = this.authService.subscribeAuth().subscribe( (isLoggedIn) => {
     if (isLoggedIn) {this.slots$ = this.dataService.leggiSlot(this.authService.getUserData().corso);}
   })

  }
}
