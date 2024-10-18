import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDate } from '../interface/date.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'transacao-datepicker',
  templateUrl: './transacao-datepicker.component.html',
  styleUrls: ['./transacao-datepicker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
export class TransacaoDatepickerComponent implements OnInit {
  public date = new FormControl(moment());
  public currentMonth!: IDate;
  public currentYear!: number;
  public listOfMonths: IDate[] = [
   {index: 0, name: "JAN"},
   {index: 1, name: "FEV"},
   {index: 2, name: "MAR"},
   {index: 3, name: "ABR"},
   {index: 4, name: "MAI"},
   {index: 5, name: "JUN"},
   {index: 6, name: "JUL"},
   {index: 7, name: "AGO"},
   {index: 8, name: "SET"},
   {index: 9, name: "OUT"},
   {index: 10, name: "NOV"},
   {index: 11, name: "DEZ"}
  ];

 @Output() selectedYearEmiter: EventEmitter<number> = new EventEmitter<number>;
 @Output() selectedMonthEmiter: EventEmitter<IDate> = new EventEmitter<IDate>;
 @Output() nextMonthEmiter: EventEmitter<IDate> = new EventEmitter<IDate>;
 @Output() previousMonthEmiter: EventEmitter<IDate> = new EventEmitter<IDate>;

  constructor() {}

  ngOnInit(): void {
    this.currentMonth = {
      index: new Date().getMonth(),
      name: new Date().toLocaleString('default', { month: 'long' })
    }
    this.currentYear = new Date().getFullYear();
  }

  public changeMonth(monthIndex: number) {
    const newMonth = new Date(new Date().setMonth(monthIndex));
    this.currentMonth = {
      index: newMonth.getMonth(),
      name: newMonth.toLocaleString('default', {month: 'long'})
    }

    this.selectedMonthEmiter.emit(this.currentMonth);
  }

  public goToTheNextMonth() {
    const newMonth = new Date(new Date().setMonth(this.currentMonth.index + 1));
    this.currentMonth = {
      previousIndex: this.currentMonth.index,
      index: newMonth.getMonth(),
      name: newMonth.toLocaleString('default', {month: 'long'})
    }

    if(this.currentMonth.previousIndex == 11) {
      this.currentYear = this.currentYear + 1;
    }

    this.nextMonthEmiter.emit(this.currentMonth)
  }

  public goToThePreviousMonth() {
    const newMonth = new Date(new Date().setMonth(this.currentMonth.index - 1));
    this.currentMonth = {
      previousIndex: this.currentMonth.index,
      index: newMonth.getMonth(),
      name: newMonth.toLocaleString('default', {month: 'long'})
    }

    if(this.currentMonth.previousIndex == 0) {
      this.currentYear = this.currentYear - 1;
    }


    this.previousMonthEmiter.emit(this.currentMonth)
  }

  public chosenYearHandler(normalizedYear: Moment, dp: any) {
    const ctrlValue: Moment = this.date.value || moment();
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.currentYear = normalizedYear.year();

    this.selectedYearEmiter.emit(this.currentYear);
    dp.close();
  }

}
