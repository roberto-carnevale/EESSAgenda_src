import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: 'signin.component.html',
})
export class SignInComponent implements OnInit {
  errorValidation = false;
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
      this.errorValidation = true;
      return;
    }
    if (this.corso) {
      this.data.creaEsercitanteDaLink(nome, this.corso, email, password);
      this.registrazione = true;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 10);
    }
  }
}
