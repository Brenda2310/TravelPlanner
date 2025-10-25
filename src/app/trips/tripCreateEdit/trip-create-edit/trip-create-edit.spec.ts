import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCreateEdit } from './trip-create-edit';

describe('TripCreateEdit', () => {
  let component: TripCreateEdit;
  let fixture: ComponentFixture<TripCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
