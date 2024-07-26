import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
