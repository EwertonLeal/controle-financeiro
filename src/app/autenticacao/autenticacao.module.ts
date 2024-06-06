import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../core/material/material.module';
import { LoginFormComponent } from '../shared/components/login-form/login-form.component';
import { RegisterFormComponent } from '../shared/components/register-form/register-form.component';
import { AuthRoutingModule } from './autenticacao-routing.module';

@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    LoginComponent,
    CadastrarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    AuthRoutingModule
  ],
  exports: [
    LoginFormComponent,
    LoginComponent,
    CadastrarComponent,
    RegisterFormComponent,
  ]
})
export class AutenticacaoModule { }
