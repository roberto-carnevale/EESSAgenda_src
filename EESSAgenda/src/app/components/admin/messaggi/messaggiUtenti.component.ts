import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: 'messaggi.component.html'
})
export class MessaggiUtentiComponent implements OnInit {
  constructor(private data:DataService) { }

  ngOnInit() {
    this.data.leggiUtentiCorso
  }
}



