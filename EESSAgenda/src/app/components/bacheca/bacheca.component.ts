import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Utente } from 'src/models/model';

@Component({
  templateUrl: 'bacheca.component.html',
})
export class BachecaComponent implements OnInit, OnDestroy {
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}
  subscription_component: Subscription = new Subscription();
  bachecaPersonale: string[] = [];
  bacheca_corso$: Observable<string[] | undefined> = new Observable<
    string[] | undefined
  >();
  corso: string = '';

  ngOnInit() {
    if (this.authService.getUserId() !== '') {
      this.preparaBachecaPersonale(this.authService.getUserData());
      this.subscription_component.add(
        this.dataService
          .cercaUtente(this.authService.getUserData().id)
          .subscribe((u) => {
            this.preparaBachecaPersonale(u!);
              this.bacheca_corso$ = this.dataService.leggiBachecaCorso(
                u!.corso
              );
          })
      );
    } else {
      this.subscription_component.add(
        this.authService.subscribeAuth().subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            this.preparaBachecaPersonale(this.authService.getUserData());
            this.subscription_component.add(
              this.dataService
                .cercaUtente(this.authService.getUserData().id)
                .subscribe((u) => {
                  this.preparaBachecaPersonale(u!);
                  this.bacheca_corso$ = this.dataService.leggiBachecaCorso(
                      u!.corso
                    );
                })
            );
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription_component.unsubscribe()
  }

  preparaBachecaPersonale(utente: Utente) {
    //aggiornamento bacheca personale
    utente.bacheca
      ? (this.bachecaPersonale = utente.bacheca)
      : (this.bachecaPersonale = []);
    this.corso = utente.corso;
  }
}
