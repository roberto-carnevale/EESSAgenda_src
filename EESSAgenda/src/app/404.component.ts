import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<h1>Pagina non trovata</h1><p>A breve sarai reindirizzato alla home page della app.</p>`
})

export class NotFound404Component implements OnInit{
  constructor(private router : Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 9000);
  }
}
