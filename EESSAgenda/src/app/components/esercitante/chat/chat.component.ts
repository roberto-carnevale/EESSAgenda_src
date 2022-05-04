//
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ChatMessage } from 'src/models/model';

@Component({
  selector: 'selector-name',
  template: `<p>Chat di gruppo, i messaggi saranno inviati a tutti.<p>
  <mat-form-field style="padding:1rem;">
    <input matInput  #msg size="90" />
  </mat-form-field>
    <button mat-icon-button (click)="addMsg(msg.value)"><mat-icon>send</mat-icon></button>
    <div style="background-color: #efe9f7; padding-top:2rem;padding-bottom:1rem;padding-left:2rem">
    <table>
    <ng-container *ngFor="let msgItem of msg$ | async" >
      <tr><td>{{JSON.parse(msgItem.date)|date:'dd/MM hh:mm' }} || {{msgItem.user}} </td><td style="padding-left:1em"> {{msgItem.msg}} </td></tr>
    </ng-container></table></div>`,
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
