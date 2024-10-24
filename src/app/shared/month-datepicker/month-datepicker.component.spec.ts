import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDatepickerComponent } from './month-datepicker.component';

describe('MonthDatepickerComponent', () => {
  let component: MonthDatepickerComponent;
  let fixture: ComponentFixture<MonthDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthDatepickerComponent]
    });
    fixture = TestBed.createComponent(MonthDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
