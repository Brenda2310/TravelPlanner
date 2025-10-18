import { TestBed } from '@angular/core/testing';

import { TripStore } from './trip-store';

describe('TripStore', () => {
  let service: TripStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
