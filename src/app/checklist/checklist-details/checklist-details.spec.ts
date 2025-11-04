import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistDetails } from './checklist-details';

describe('ChecklistDetails', () => {
  let component: ChecklistDetails;
  let fixture: ComponentFixture<ChecklistDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
