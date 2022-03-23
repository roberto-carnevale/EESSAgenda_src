import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataComponent } from './components/data.component';

import { DataService } from './services/data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

  ],
  providers: [ DataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
