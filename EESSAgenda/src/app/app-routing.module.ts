import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrenotazioniComponent } from 'src/app/components/esercitante/prenotazioni/prenotazioni.component'
import { NotFound404Component } from './404.component';
import { BachecaComponent } from './components/bacheca/bacheca.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/login/signin/signin.component';
import { AllegatiComponent } from './components/esercitante/allegati/allegati.component';

import { LoginGuard } from './services/guard.service';
import { AdminGuard } from './services/adminGuard.component';
import { GuidaGuard } from './services/guidaGuard.component';

const routes: Routes = [{ path:"" , component: PrenotazioniComponent, canActivate: [LoginGuard] },
  { path:"prenotazioni/:id" , component: PrenotazioniComponent, canActivate: [LoginGuard] },
{path:'admin', loadChildren: ()=>import('./components/admin/admin.module').then(m => m.AdminModule), canLoad:[AdminGuard]},
{path:'login', component:LoginComponent},
{path:'guida', loadChildren: ()=>import('./components/guida/guida.module').then(m=>m.GuidaModule), canLoad:[GuidaGuard]},
{path:'bacheca', component:BachecaComponent, canActivate: [LoginGuard]},
{path:'allegati', component:AllegatiComponent, canActivate: [LoginGuard]},
{path:'signin/:key', component:SignInComponent},
{path:'**', component:NotFound404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
