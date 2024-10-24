import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaidasComponent } from './saidas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransacaoDatepickerComponent } from 'src/app/shared/transacao-datepicker/transacao-datepicker.component';
import { SaidasRoutingModule } from './saidas-routing.module';
import { SaidasModalComponent } from './saidas-modal/saidas-modal.component';


@NgModule({
  declarations: [
    SaidasComponent,
    SaidasModalComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SaidasRoutingModule,
    MaterialModule,
    TransacaoDatepickerComponent,
    SharedModule
  ]
})
export class SaidasModule { }
