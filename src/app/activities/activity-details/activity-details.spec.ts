import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetails } from './activity-details';

describe('ActivityDetails', () => {
  let component: ActivityDetails;
  let fixture: ComponentFixture<ActivityDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
