import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradasRoutingModule } from './entradas-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntradasComponent } from './entradas.component';
import { ReceitasModalComponent } from './receitas-modal/receitas-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EntradasComponent,
    ReceitasModalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EntradasRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EntradasModule { }
