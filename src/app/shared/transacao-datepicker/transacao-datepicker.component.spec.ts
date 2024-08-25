import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoDatepickerComponent } from './transacao-datepicker.component';

describe('TransacaoDatepickerComponent', () => {
  let component: TransacaoDatepickerComponent;
  let fixture: ComponentFixture<TransacaoDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransacaoDatepickerComponent]
    });
    fixture = TestBed.createComponent(TransacaoDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
