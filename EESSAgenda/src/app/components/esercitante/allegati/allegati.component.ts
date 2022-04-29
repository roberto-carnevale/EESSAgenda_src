import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { File } from 'src/models/model';

@Component({
  templateUrl: 'allegati.component.html',
})
export class AllegatiComponent implements OnInit {
  constructor(private data: DataService, private authService: AuthService) {}
  corso: string = '';
  allegati$: Observable<File[] | undefined> = new Observable<File[] | undefined>();
  subscription_component = new Subscription()

  ngOnInit() {
    if (this.authService.getUserId() !== '') {
      const myself = this.authService.getUserData();
      this.allegati$ = this.data.leggiAllegati(myself.corso);
      this.corso = myself.corso;
    } else {
        this.subscription_component.add(
          this.authService.subscribeAuth().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              const myself = this.authService.getUserData();
              this.allegati$ = this.data.leggiAllegati(myself.corso);
              this.corso = myself.corso;
            }
          })
        );
    }

  }

}
