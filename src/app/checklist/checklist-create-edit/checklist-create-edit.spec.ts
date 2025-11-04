import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCreateEdit } from './checklist-create-edit';

describe('ChecklistCreateEdit', () => {
  let component: ChecklistCreateEdit;
  let fixture: ComponentFixture<ChecklistCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
