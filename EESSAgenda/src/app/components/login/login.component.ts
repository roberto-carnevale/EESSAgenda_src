import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  constructor(private authService:AuthService) { }

  ngOnInit() {
    
  }

  onSubmit(login:string, password:string) {
    this.authService.setUser({email:login, password:password});
  }

  onReset(email:string) {
    this.authService.resetUser(email);
  }

}
