import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private auth:AuthService, private authFirebase:AngularFireAuth) {}
  title = 'EESSAgenda';
  nome = "";

  ngOnInit(): void {
    this.authFirebase.currentUser.then((u) => {this.nome = u?.email!});
  }

}
