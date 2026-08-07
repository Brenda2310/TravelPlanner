import { TestBed } from '@angular/core/testing';

import { TripInvitationService } from './trip-invitation-service';

describe('TripInvitationService', () => {
  let service: TripInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
