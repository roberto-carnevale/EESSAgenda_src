import { GuidaRoutingModule } from './guida.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { GuidaComponent } from './guida.component';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const Modules = [
  CommonModule,
  GuidaRoutingModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule
]

@NgModule({
  imports: [Modules],
  exports: [GuidaComponent],
  declarations: [GuidaComponent],
  providers: [],
})
export class GuidaModule { }


