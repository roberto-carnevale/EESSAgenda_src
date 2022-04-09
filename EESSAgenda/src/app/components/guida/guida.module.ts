import { GuidaRoutingModule } from './guida.routing';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { GuidaComponent } from './guida.component';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar';

const Modules = [
  CommonModule,
  GuidaRoutingModule,
  AngularFirestoreModule,
  MatButtonModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
]

@NgModule({
  imports: [CommonModule],
  exports: [GuidaComponent, CommonModule],
  declarations: [GuidaComponent],
  providers: [AuthService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'it-IT'}],
})
export class GuidaModule { }


