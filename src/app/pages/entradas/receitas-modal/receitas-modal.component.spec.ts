import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitasModalComponent } from './receitas-modal.component';

describe('ReceitasModalComponent', () => {
  let component: ReceitasModalComponent;
  let fixture: ComponentFixture<ReceitasModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceitasModalComponent]
    });
    fixture = TestBed.createComponent(ReceitasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
