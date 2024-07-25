import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class LoginModule { }
