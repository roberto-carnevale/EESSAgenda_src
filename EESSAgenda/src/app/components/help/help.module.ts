import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { HelpRoutingModule } from './help.routing';
import { MatIconModule } from '@angular/material/icon';
import { HelpComponent } from './help.components';

@NgModule({
  imports: [CommonModule, HelpRoutingModule, MatIconModule],
  exports: [HelpComponent, HelpRoutingModule],
  declarations: [HelpComponent],
  providers: [AngularFirestore],
})
export class HelpModule { }

//
