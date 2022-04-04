import { Component, OnInit } from '@angular/core';
import { Agenda } from 'src/models/model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prenotazioni-name',
  templateUrl: 'prenotazioni.component.html',
})
export class PrenotazioniComponent implements OnInit {
  constructor(private dataService: DataService) {}
  
  agendaList : Agenda[] = [{ id: '1', corso: '1', guida: '1', slot: [], url: '1' }]
  //agenda: Agenda = { id: '', corso: '', guida: '', agenda: [], url: '' };
  
  ngOnInit() {

  }
}
