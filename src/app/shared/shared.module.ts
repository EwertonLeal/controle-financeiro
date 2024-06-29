import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './components/banner/banner.component';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { MaterialModule } from '../core/material/material.module';
import { CadastroModalComponent } from './components/cadastro-modal/cadastro-modal.component';
import { NgbootstrapModule } from '../core/ngbootstrap/ngbootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FormWrapperComponent,
    BannerComponent,
    CadastroModalComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    NgbootstrapModule
  ],
  exports: [
    FormWrapperComponent,
    BannerComponent,
    CadastroModalComponent
  ],
  providers: [

  ]
})
export class SharedModule { }
