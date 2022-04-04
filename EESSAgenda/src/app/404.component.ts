import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<h1>404</h1>`
})

export class NotFound404Component implements OnInit{
  constructor(private router : Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 5000);
  }
}
