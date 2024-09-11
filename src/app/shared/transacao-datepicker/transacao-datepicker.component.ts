import { Component, OnInit } from '@angular/core';
import { IDate } from './interface/date.interface';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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
  }

  public goToTheNextMonth() {
    this.changeMonth(this.currentMonth.index + 1)
  }

  public goToThePreviousMonth() {
    this.changeMonth(this.currentMonth.index - 1)
  }

  public chosenYearHandler(normalizedYear: Moment, dp: any) {
    const ctrlValue: Moment = this.date.value || moment();
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.currentYear = normalizedYear.year();

    dp.close();
  }

}
