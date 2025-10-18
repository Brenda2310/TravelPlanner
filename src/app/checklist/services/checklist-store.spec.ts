import { TestBed } from '@angular/core/testing';

import { ChecklistStore } from './checklist-store';

describe('ChecklistStore', () => {
  let service: ChecklistStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
