import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrenotazioniComponent } from 'src/app/components/esercitante/prenotazioni/prenotazioni.component'
import { NotFound404Component } from './404.component';
import { BachecaComponent } from './components/bacheca/bacheca.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/login/signin/signin.component';
import { AllegatiComponent } from './components/esercitante/allegati/allegati.component';

import { LoginGuard } from './services/guard.service';
import { AdminGuard } from './services/adminGuard.service';
import { GuidaGuard } from './services/guidaGuard.service';
import { HomeComponent } from './components/home.component';
import { CambioCorsoComponent } from './components/login/signin/cambioCorso.component';
import { ChatComponent } from './components/esercitante/chat/chat.component';

const routes: Routes = [
  { path:"" , component: HomeComponent, canActivate: [LoginGuard] },
  { path:"prenotazioni" , component: PrenotazioniComponent, canActivate: [LoginGuard] },
  {path:'admin', loadChildren: ()=>import('./components/admin/admin.module').then(m => m.AdminModule), canLoad:[AdminGuard]},
  {path:'login', component:LoginComponent},
  {path:'guida', loadChildren: ()=>import('./components/guida/guida.module').then(m=>m.GuidaModule), canLoad:[GuidaGuard]},
  {path:'bacheca', component:BachecaComponent, canActivate: [LoginGuard]},
  {path:'allegati', component:AllegatiComponent, canActivate: [LoginGuard]},
  {path:'chat', component:ChatComponent, canActivate: [LoginGuard]},
  {path:'signin/:key', component:SignInComponent},
  {path:'cambio/:key', component:CambioCorsoComponent},
  {path:'**', component:NotFound404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
