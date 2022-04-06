import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { TipoUtente, Utente } from 'src/models/model';

@Component({
  selector: 'app-semaforo',
  template: `<div [ngClass]="classeCSS">{{guida}}</div>`,
  styleUrls: ['semaforo.component.css'],
})
export class SemaforoComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private auth: AuthService, private data: DataService) {}
  utente: Utente = {
    corso: '',
    email: '',
    nome: '',
    ruolo: TipoUtente.Guida,
    uid: '',
    url: '',
    in_colloquio: false,
    id:''
  };
  componemntSubcriptions = new Subscription();
  statoGuida: boolean = false;

  classeCSS = 'green';
  loggedIn = false;

  @Input() guida: string = '';

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.componemntSubcriptions.add(
      this.data.statoGuida(this.guida).subscribe((s) => {
        console.log(s);
        s ? (this.classeCSS = 'red') : (this.classeCSS = 'green');
      })
    );
  }

  ngOnDestroy(): void {
    this.componemntSubcriptions.unsubscribe();
  }
}
