import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidasModalComponent } from './saidas-modal.component';

describe('SaidasModalComponent', () => {
  let component: SaidasModalComponent;
  let fixture: ComponentFixture<SaidasModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaidasModalComponent]
    });
    fixture = TestBed.createComponent(SaidasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
