import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './components/banner/banner.component';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { MaterialModule } from '../core/material/material.module';

@NgModule({
  declarations: [
    FormWrapperComponent,
    BannerComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FormWrapperComponent,
    BannerComponent,
  ],
  providers: [

  ]
})
export class SharedModule { }
