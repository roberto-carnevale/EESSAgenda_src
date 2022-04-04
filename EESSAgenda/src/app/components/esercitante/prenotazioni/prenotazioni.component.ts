import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prenotazioni-name',
  templateUrl: 'prenotazioni.component.html',
})
export class PrenotazioniComponent implements OnInit {
  constructor(private dataService: DataService) {}


  //agenda: Agenda = { id: '', corso: '', guida: '', agenda: [], url: '' };

  ngOnInit() {

  }
}
