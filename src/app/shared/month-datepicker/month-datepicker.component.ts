import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MaterialModule } from '../material/material.module';
import { MY_FORMATS } from '../transacao-datepicker/transacao-datepicker.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { MonthAndYear } from '../models/month-year.model';
import { setMonthAndYear } from 'src/app/state/month-year/month-year.actions';

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
  currentYear: number = moment().year();
  @Output() public monthEmitter = new EventEmitter<Date | null>();

  constructor(private store: Store) {}

  public emitDateChange(event: MatDatepickerInputEvent<Date | null, unknown>): void {
    this.monthEmitter.emit(event.value);
  }

  public monthChanged(monthSelected: Moment, widget: any): void {
    this.currentMonth = monthSelected.locale('pt-br').format('MMMM');
    this.currentYear = monthSelected.year();
    this.dispatchIfReady(monthSelected.month(), monthSelected.year());
    widget.close();
  }

  private dispatchIfReady(month: number, year: number) {
    const monthAndYear: MonthAndYear = { month, year };
    this.store.dispatch(setMonthAndYear({ monthAndYear }));
  }

}
