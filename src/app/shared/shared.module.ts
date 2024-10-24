import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonthDatepickerComponent } from './month-datepicker/month-datepicker.component';


@NgModule({
  declarations: [
    BannerComponent,
    NavBarComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    MonthDatepickerComponent
  ],
  exports: [
    BannerComponent,
    NavBarComponent,
  ]
})
export class SharedModule { }
