import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: 'signin.component.html',
})
export class SignInComponent implements OnInit {
  errorValidation = false;
  passwordDiverse = false;
  registrazione = false;
  corso: string = '';

  constructor(
    private auth: AuthService,
    private data: DataService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.setUser(null);
    this.actRoute.params.subscribe((p) => {
      const key: string = p['key'];
      if (key) {
        this.auth.trovaCorsoConChiave(key).then((corso) => {
          if (corso) this.corso = corso;
        });
      }
    });
  }

  onSubmit(email: string, password: string, passwordx2: string, nome: string) {
    this.errorValidation = false;
    if (password != passwordx2) {
      this.passwordDiverse = true;
      setTimeout(() => {
        this.passwordDiverse = false;
      }, 5000);
      return;
    }
    /*
(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])
    */
    if (nome.length < 3 || password.length < 6 || email.indexOf('@')<1){
      this.errorValidation = true;
      setTimeout(() => {
        this.errorValidation = false;
      }, 5000);
      return;
    }

    if (this.corso) {
      this.data.creaEsercitanteDaLink(nome, this.corso, email, password);
      this.registrazione = true;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    }
  }

  backToLogin(){
    this.router.navigate(['/login']);
  }
}
