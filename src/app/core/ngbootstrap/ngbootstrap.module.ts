import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NgbModule,
    NgbPaginationModule,
  ]
})
export class NgbootstrapModule { }
