import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Slots, TipoUtente, Utente } from 'src/models/model';

@Component({
  selector: 'app-prenotazioni-name',
  templateUrl: 'prenotazioni.component.html',
})
export class PrenotazioniComponent implements OnInit, OnDestroy {
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  slots: Slots[] = [];
  subscription_component = new Subscription();
  slot_aggregati: { guida: string; slots: Slots[] }[] = [];
  nomi_guide: {email:string, nome:string}[] = [];
  dataOK : boolean = false;

  myself: Utente = {
    corso: '',
    email: '',
    nome: '',
    ruolo: TipoUtente.Esercitante,
  };

  ngOnInit(): void {
    if (this.authService.getUserId() !== '') {
      this.preparaDati();
    } else {
        this.subscription_component.add(
          this.authService.subscribeAuth().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.preparaDati();
            }
          })
        );
    }
  }

  preparaDati() {
    this.myself = this.authService.getUserData();
    this.subscription_component.add(
      this.dataService
        .leggiSlot(this.authService.getUserData().corso)
        .subscribe((ls) => {
          if (this.slot_aggregati.length > 0) {
            this.slots = ls;
            this.changeDetectorRef.markForCheck();
          } else {
            this.slots = ls;
            let guida_temp = '';
            let current_guida_index = -1;
            console.log(ls);
            for (let i = 0; i < ls.length; i++) {
              if (guida_temp != ls[i].guida) {
                this.dataService.nomeGuida(ls[i].guida).then(g => {this.nomi_guide.push({email:ls[i].guida, nome:g})})
                current_guida_index = this.slot_aggregati.push({
                  guida: ls[i].guida,
                  slots: [ls[i]],
                })-1;
                guida_temp = ls[i].guida;
              } else {
                this.slot_aggregati[current_guida_index].slots.push(ls[i]);
              }
            }
          }
          console.log("COMPLETED")
          this.dataOK = true;
        })
    );
  }

  prendiNomeGuida(email:string):string {
    return this.nomi_guide.filter( g => g.email == email)[0].nome;
  }

  ngOnDestroy(): void {
    this.subscription_component.unsubscribe();
  }

  prenota(slot: Slots) {
    slot.occupato = this.myself.email;
    this.dataService.prenotaSlot(slot);
  }
  libera(slot: Slots) {
    slot.occupato = '';
    this.dataService.prenotaSlot(slot);
  }

  statoSlot(slotId: string): string {
    return this.slots.find((s) => s.id === slotId)?.occupato!;
  }
  stileSlot(occupato: string): any {
    switch (occupato) {
      case this.myself.email:
        return { color: 'green', 'font-weight': 'bold' };
      case '':
        return {};
      default : if (occupato!= '' && occupato!= this.myself.email)
        return { color: 'light-gray', 'text-decoration': 'line-through' };
    }
  }
}
