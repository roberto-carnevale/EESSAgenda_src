import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrenotazioniComponent } from 'src/app/components/esercitante/prenotazioni/prenotazioni.component'
import { NotFound404Component } from './404.component';
import { GuidaComponent } from './components/guida/guida.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [{ path:"" , component: PrenotazioniComponent },
  { path:"prenotazioni/:id" , component: PrenotazioniComponent },
{path:'admin', loadChildren: ()=>import('./components/admin/admin.module').then(m => m.AdminModule)},
{path:'login', component:LoginComponent},
{path:'guida', component:GuidaComponent},
{path:'**', component:NotFound404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
