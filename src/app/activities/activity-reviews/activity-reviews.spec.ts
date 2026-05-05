import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReviews } from './activity-reviews';

describe('ActivityReviews', () => {
  let component: ActivityReviews;
  let fixture: ComponentFixture<ActivityReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
