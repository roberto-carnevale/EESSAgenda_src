import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './signin.component';
import { SignInRoutingModule } from './signin.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, SignInRoutingModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  exports: [SignInComponent, SignInRoutingModule],
  declarations: [SignInComponent],
  providers: [],
})
export class SignInModule { }

//
