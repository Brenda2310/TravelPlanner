import { TestBed } from '@angular/core/testing';

import { ChecklistItemStore } from './checklist-item-store';

describe('ChecklistItemStore', () => {
  let service: ChecklistItemStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistItemStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
