import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFilters } from './activity-filters';

describe('ActivityFilters', () => {
  let component: ActivityFilters;
  let fixture: ComponentFixture<ActivityFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
