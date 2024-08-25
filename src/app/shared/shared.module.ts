import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TransacaoDatepickerComponent } from './transacao-datepicker/transacao-datepicker.component';


@NgModule({
  declarations: [
    BannerComponent,
    NavBarComponent,
    TransacaoDatepickerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BannerComponent,
    NavBarComponent,
    TransacaoDatepickerComponent
  ]
})
export class SharedModule { }
