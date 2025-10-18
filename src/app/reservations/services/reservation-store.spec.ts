import { TestBed } from '@angular/core/testing';

import { ReservationStore } from './reservation-store';

describe('ReservationStore', () => {
  let service: ReservationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
