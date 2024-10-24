import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IDate } from '../models/date.interface';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MaterialModule } from '../material/material.module';
import { MY_FORMATS } from '../transacao-datepicker/transacao-datepicker.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'month-datepicker',
  templateUrl: './month-datepicker.component.html',
  styleUrls: ['./month-datepicker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthDatepickerComponent {
  currentMonth: string =  moment().locale('pt-br').format('MMMM');
  @Output() public monthEmitter = new EventEmitter<Date | null>();

  public emitDateChange(event: MatDatepickerInputEvent<Date | null, unknown>): void {
    this.monthEmitter.emit(event.value);
  }

  public monthChanged(monthSelected: Moment, widget: any): void {
    this.currentMonth = monthSelected.locale('pt-br').format('MMMM');
    widget.close();
  }
}
