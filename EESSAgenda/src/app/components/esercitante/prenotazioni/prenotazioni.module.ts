import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { PrenotazioniComponent } from './prenotazioni.component';
import { SemaforoComponent } from '../semaforo/semaforo.component';
import { PrenotazioniRoutingModule } from './prenotazioni.routing';

@NgModule({
  imports: [CommonModule, PrenotazioniRoutingModule, MatExpansionModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule, MatButtonModule],
  exports: [PrenotazioniComponent, SemaforoComponent, PrenotazioniRoutingModule],
  declarations: [PrenotazioniComponent, SemaforoComponent],
  providers: [],
})
export class PrenotazioniModule { }


