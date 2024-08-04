import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { signUpSignInGuard } from 'src/app/core/guards/signIn-signUp.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [signUpSignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingRoutingModule { }
