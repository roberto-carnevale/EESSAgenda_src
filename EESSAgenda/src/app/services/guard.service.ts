
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {
  constructor(private auth:AuthService, private route:Router) { }
  guardedPath: string | null = null;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.getUserId() != '') return true;
    this.auth.guardedPath = route.url.toString();
    console.log(this.auth.guardedPath);
    this.route.navigate(['/login']);
    return false;
  }
}
//
