import { GuidaRoutingModule } from './guida.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { GuidaComponent } from './guida.component';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';


const Modules = [
  CommonModule,
  GuidaRoutingModule,
  MatButtonModule,
  MatIconModule,
]

@NgModule({
  imports: [Modules],
  exports: [GuidaComponent],
  declarations: [GuidaComponent],
  providers: [],
})
export class GuidaModule { }


