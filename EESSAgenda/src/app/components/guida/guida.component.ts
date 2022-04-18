import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { TipoUtente, Utente } from 'src/models/model';
import { take, tap } from 'rxjs/operators';

@Component({
  templateUrl: 'guida.component.html',
})
export class GuidaComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('fab_icon') fab_icon!: any;
  in_colloquio = false;
  componentSubcriptions = new Subscription();
  utente: Utente = {
    corso: '',
    email: '',
    nome: '',
    ruolo: TipoUtente.Guida,
    uid: '',
    url: '',
    in_colloquio: false,
    id: '',
  };
  agendaGuida$: Observable<{ ora: string; esercitante: string }[]> =
    new Observable<{ ora: string; esercitante: string }[]>();
  utentiCorso: Utente[] = [];
  constructor(private auth: AuthService, private data: DataService) {}

  ngOnInit() {
    if (this.auth.getUserId() !== '') {
      this.preparaDati();
    } else {
      this.componentSubcriptions.add(
        this.auth.subscribeAuth().subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            this.preparaDati();
          }
        })
      );
    }
  }
  ngOnDestroy(): void {
    this.componentSubcriptions.unsubscribe();
  }
  ngAfterContentChecked(): void {
    if (this.fab_icon) {
      this.in_colloquio
        ? (this.fab_icon._elementRef.nativeElement.textContent =
            'airline_seat_recline_normal')
        : (this.fab_icon._elementRef.nativeElement.textContent = 'chair');
    }
  }

  preparaDati() {
    this.utente = this.auth.getUserData();
    this.componentSubcriptions.add(
      this.data
        .leggiUtentiCorso(this.utente.corso)
        .pipe(
          take(1),
          tap((lu) => {
            this.utentiCorso = lu;
          })
        )
        .subscribe()
    );
    this.in_colloquio = this.utente.in_colloquio!;
    console.log(this.utente);
    this.agendaGuida$ = this.data.leggiAgendaGuida(this.utente);
  }

  switch() {
    this.in_colloquio = !this.in_colloquio;
    this.in_colloquio
      ? (this.fab_icon._elementRef.nativeElement.textContent =
          'airline_seat_recline_normal')
      : (this.fab_icon._elementRef.nativeElement.textContent = 'chair');
    this.utente.in_colloquio = this.in_colloquio;
    console.log(this.utente);
    this.data.cambiaStato(this.utente);
  }

  libero(s: string): any {
    if (s == '') return { 'background-color': 'lightgreen' };
  }

  nomeDaEmailUtente(email:string):string {
    return this.utentiCorso.find( u => u.email == email)?.nome!;
  }
}
