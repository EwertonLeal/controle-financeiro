import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { BannerComponent } from 'src/app/shared/banner/banner.component';



@NgModule({
  declarations: [
    LoginComponent,
    BannerComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingRoutingModule,
    MaterialModule
  ]
})
export class LoginModule { }
