import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBrowser } from './activity-browser';

describe('ActivityBrowser', () => {
  let component: ActivityBrowser;
  let fixture: ComponentFixture<ActivityBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityBrowser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
