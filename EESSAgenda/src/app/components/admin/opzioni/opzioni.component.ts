import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AdminDataService } from 'src/app/services/adminData.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { OpzioniPiattaforma } from 'src/models/model';
import { take } from 'rxjs'

@Component({
  templateUrl: 'opzioni.component.html'
})

export class OpzioniAdminComponent implements OnInit {
  constructor(private data : DataService, private admindata:AdminDataService, private auth : AuthService, private router: Router) { }
  opzioni : string[] = []
  numero_opzione : number[] = []
  corso :string = "";
  opzioni_corso:boolean[] = []
  opzioni_attive:number[] = []

  ngOnInit() {
    this.corso = this.auth.getUserData().corso;
    this.data.leggiCorso(this.corso).pipe( take(1) ).subscribe( c => {
      this.opzioni_attive = c?.opzioni!
      for (let item in OpzioniPiattaforma) {if (isFinite(Number(item))) this.opzioni_corso[Number(item)] = false;}
      this.opzioni_attive.forEach(element => {
        this.opzioni_corso[element] = true;
      });
    })
    for (let item in OpzioniPiattaforma) {
      if (isNaN(Number(item))) {
          this.opzioni.push(item);
      }
      if (isFinite(Number(item))) {
        this.numero_opzione.push(Number(item));
    }


  }
  }

  changeVal(event:MatCheckboxChange) {
    if (event.checked) {
      this.opzioni_attive.push(Number(event.source.value))
    } else {
      this.opzioni_attive = this.opzioni_attive.filter( opz => opz != Number(event.source.value))
    }
    this.admindata.opzioniCorso(this.corso, this.opzioni_attive);
  }
}

//
