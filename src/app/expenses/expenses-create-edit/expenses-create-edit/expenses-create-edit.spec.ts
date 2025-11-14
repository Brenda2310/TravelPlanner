import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesCreateEdit } from './expenses-create-edit';

describe('ExpensesCreateEdit', () => {
  let component: ExpensesCreateEdit;
  let fixture: ComponentFixture<ExpensesCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
