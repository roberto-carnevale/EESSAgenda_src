import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { TipoUtente, Utente } from 'src/models/model';

@Component({
  selector: 'app-semaforo',
  template: `<div [ngClass]="classeCSS">{{ prendiNomeGuida(guida) }}</div>`,
  styleUrls: ['semaforo.component.css'],
})
export class SemaforoComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService, private data: DataService) {}
  utente: Utente = {
    corso: '',
    email: '',
    nome: '',
    ruolo: TipoUtente.Guida,
    url: '',
    in_colloquio: false,
  };
  componemntSubcriptions = new Subscription();
  statoGuida: boolean = false;

  classeCSS = 'green';
  loggedIn = false;
  nomi_guide: { email: string; nome: string }[] = [];

  @Input() guida: string = '';

  ngOnInit() {
    this.componemntSubcriptions.add(
      this.data.statoGuida(this.guida).subscribe((s) => {
        this.data.nomeGuida(this.guida).then((g) => {
          this.nomi_guide.push({ email: this.guida, nome: g });
        });
        console.log(s);
        s ? (this.classeCSS = 'red') : (this.classeCSS = 'green');
      })
    );
  }

  ngOnDestroy(): void {
    this.componemntSubcriptions.unsubscribe();
  }

  prendiNomeGuida(email: string): string {
    let nome = '';
    return this.nomi_guide.filter((g) => g.email == email)[0].nome;
  }
}
