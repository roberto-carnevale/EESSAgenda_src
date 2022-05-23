import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-semaforo',
  templateUrl: 'semaforo.component.html',
  styleUrls: ['semaforo.component.css'],
})
export class SemaforoComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService, private data: DataService, private sanitizer: DomSanitizer) {}
  componentSubcriptions = new Subscription();
  statoGuida: boolean = false;
  url: string = '';

  classeCSS = 'green';
  loggedIn = false;
  nomi_guide: { email: string; nome: string; url: SafeUrl, unsafeUrl:string} = {
    email: '',
    nome: '',
    url: '',
    unsafeUrl:''
  };

  @Input() guida: string = '';

  ngOnInit() {
    this.data.nomeUtente(this.guida).then((g) => {
      this.data.urlGuida(this.guida).then((u) => {
        this.nomi_guide = { email: this.guida, nome: g, url: this.sanitizer.bypassSecurityTrustResourceUrl(u!), unsafeUrl:u! };
      });
    });
    this.componentSubcriptions.add(
      this.data.statoGuida(this.guida).subscribe((s) => {
        s ? (this.classeCSS = 'red') : (this.classeCSS = 'green');
        this.statoGuida = s;
      })
    );
  }

  ngOnDestroy(): void {
    this.componentSubcriptions.unsubscribe();
  }

  prendiNomeGuida(email: string): string {
    let nome = '';
    return this.nomi_guide.nome;
  }
}
