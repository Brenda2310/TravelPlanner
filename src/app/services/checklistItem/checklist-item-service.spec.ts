import { TestBed } from '@angular/core/testing';

import { ChecklistItemService } from './checklist-item-service';

describe('ChecklistItemService', () => {
  let service: ChecklistItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
