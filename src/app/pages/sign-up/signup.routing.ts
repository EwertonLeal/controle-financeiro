import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { signUpSignInGuard } from 'src/app/core/guards/signIn-signUp.guard';

const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    canActivate: [signUpSignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
