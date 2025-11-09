import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCreateEdit } from './activity-create-edit';

describe('ActivityCreateEdit', () => {
  let component: ActivityCreateEdit;
  let fixture: ComponentFixture<ActivityCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
