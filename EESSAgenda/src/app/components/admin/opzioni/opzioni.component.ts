import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OpzioniPiattaforma } from 'src/models/model';

@Component({
  templateUrl: 'opzioni.component.html'
})

export class OpzioniAdminComponent implements OnInit {
  constructor() { }
  pippo : string[] = []
  pluto : number[] = []

  ngOnInit() {
    for (let item in OpzioniPiattaforma) {
      if (isNaN(Number(item))) {
          this.pippo.push(item);
      }
      if (isFinite(Number(item))) {
        this.pluto.push(Number(item));
    }
  }
  }

  changeVal(event:MatCheckboxChange) {
    if (event.checked) {
      OpzioniPiattaforma[Number(event.source.value)]
    }
    console.log(OpzioniPiattaforma[Number(event.source.value)]);
    console.log(event.checked);
  }
}

//
