import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListItem } from './check-list-item';

describe('CheckListItem', () => {
  let component: CheckListItem;
  let fixture: ComponentFixture<CheckListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
