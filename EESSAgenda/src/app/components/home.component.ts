//
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  template: `<div #home style="padding-left:5rem;padding-right:5rem"></div>
    <div
      style="background-color: #d0bde6;padding-bottom: 3rem; width: 100%;"
    ></div>
    <small style="float: right;">Powered by Roberto Carnevale</small>`,
})
export class HomeComponent implements OnInit {
  constructor(private firebase: AngularFirestore, private auth: AuthService) {}
  contenuto: string | undefined = undefined;
  @ViewChild('home') home: any | HTMLDivElement;

  ngOnInit() {
    this.firebase
      .collection<{ contenuto: string }>('home')
      .doc(this.auth.getUserData().corso)
      .valueChanges()
      .pipe(take(1))
      .subscribe((s) => {
        this.home.nativeElement.innerHTML = s?.contenuto!;
      });
  }
}

//
