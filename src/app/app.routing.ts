import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(l => l.LoginModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(s => s.SignUpModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(h => h.HomeModule)
  },
  {
    path: 'entradas',
    loadChildren: () => import('./pages/entradas/entradas.module').then(e => e.EntradasModule)
  },
  {
    path: 'saidas',
    loadChildren: () => import('./pages/saidas/saidas.module').then(e => e.SaidasModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
