//
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ChatMessage } from 'src/models/model';

@Component({
  selector: 'selector-name',
  template: `<mat-form-field style="padding:1rem;">
    <input matInput  #msg size="90" />
  </mat-form-field>
    <button mat-icon-button (click)="addMsg(msg.value)"><mat-icon>send</mat-icon></button>
    <hr>
    <span *ngFor="let msgItem of msg$ | async">
      {{JSON.parse(msgItem.date)|date:'dd/MM hh:mm' }} || {{msgItem.user}} || {{msgItem.msg}}<br/>
    </span> `,
})
export class ChatComponent implements OnInit {
  constructor(private auth: AuthService, private data: DataService) { this.JSON = JSON;}

  msg$: Observable<ChatMessage[] | undefined> = new Observable<
    ChatMessage[] | undefined
  >();
  subscription_component: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  corso: string = '';
  JSON:any=null;
  @ViewChild('msg') msgInput: any;

  ngOnInit() {
    if (this.auth.getUserId() !== '') {
      this.preparaDati();
    } else {
      this.subscription_component.add(
        this.auth.subscribeAuth().subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            this.preparaDati();
          }
        })
      );
    }
  }

  preparaDati() {
    this.corso = this.auth.getUserData().corso;
    this.msg$ = this.data.leggiChat(this.corso);
  }

  addMsg(msg: string) {
    const msgObj: ChatMessage = {
      date: JSON.stringify(new Date),
      msg: msg,
      user: this.auth.getUserData().nome,
    };
    console.log(this.msgInput)
    this.msgInput.nativeElement.value="";
    this.data.mandaChat(this.corso, msgObj);
  }
}
//
