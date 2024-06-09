import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../core/material/material.module';
import { HomeComponent } from './home/home.component';
import { NgbootstrapModule } from '../core/ngbootstrap/ngbootstrap.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    NgbootstrapModule,
    PagesRoutingModule
  ],
  exports: [

  ],
  providers: [

  ]
})
export class PagesModule { }
