import { TestBed } from '@angular/core/testing';

import { ActivityStore } from './activity-store';

describe('ActivityStore', () => {
  let service: ActivityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
