//
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  template: `
    <mat-form-field class="example-full-width" appearance="fill" style="width:100%;">
    <mat-label>Inserire il testo in formato HTML</mat-label>
    <textarea  #html matInput placeholder="<html>Formato HTML</html>"></textarea>
  </mat-form-field>
  <button mat-icon-button (click)="onSave(html.value)" color="primary">
      <mat-icon color="accent">save</mat-icon>
  </button>
  <div
      style="background-color: #d0bde6;padding-bottom: 3rem; width: 100%;"
    ></div>
  <small style="float: right;">Powered by Roberto Carnevale</small>
`
})

export class HomeAdminComponent implements OnInit {
  constructor(private firebase: AngularFirestore, private auth : AuthService, private router: Router ) { }
  contenuto : string | undefined = undefined;
  corso : string = ""
  @ViewChild('html') home: any | HTMLTextAreaElement;

  ngOnInit() {
    this.corso = this.auth.getUserData().corso;

    this.firebase
    .collection<{ contenuto: string }>('home')
    .doc(this.corso)
    .valueChanges()
    .pipe(take(1))
    .subscribe((s) => {
      console.log(this.home);
      this.home.nativeElement.textContent = s?.contenuto!;
    });

  }

  onSave( html:string) {
    this.firebase.collection<{contenuto:string}>('home').doc(this.corso).update({contenuto: html})
    this.router.navigate(['/']);
  }

}
