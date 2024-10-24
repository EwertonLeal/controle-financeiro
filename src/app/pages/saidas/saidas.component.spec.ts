import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidasComponent } from './saidas.component';

describe('SaidasComponent', () => {
  let component: SaidasComponent;
  let fixture: ComponentFixture<SaidasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaidasComponent]
    });
    fixture = TestBed.createComponent(SaidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
