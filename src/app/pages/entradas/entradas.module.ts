import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradasRoutingModule } from './entradas-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntradasComponent } from './entradas.component';
import { ReceitasModalComponent } from './receitas-modal/receitas-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransacaoDatepickerComponent } from 'src/app/shared/transacao-datepicker/transacao-datepicker.component';


@NgModule({
  declarations: [
    EntradasComponent,
    ReceitasModalComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EntradasRoutingModule,
    MaterialModule,
    TransacaoDatepickerComponent,
    SharedModule
  ]
})
export class EntradasModule { }
