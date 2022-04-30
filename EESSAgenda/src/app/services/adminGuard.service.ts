import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { take } from 'rxjs/operators';
import { TipoUtente } from 'src/models/model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanLoad {
  constructor(
    private auth: AuthService,
    private route: Router,
    private data: DataService
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return new Promise ( (resolve) => {
    if (this.auth.getUserId() != '') {
      this.data
        .cercaUtente(this.auth.getUserId())
        .pipe(take(1))
        .subscribe((u) => {
          if (
            u!.ruolo == TipoUtente.Amministratore ||
            u!.ruolo == TipoUtente.Gestore ||
            u!.ruolo == TipoUtente.GuidaSmart
          ) {
            resolve(true);
          } else {
            this.route.navigate(['/']);
            resolve(false);
          }
        });
      }
    });
  }
}
