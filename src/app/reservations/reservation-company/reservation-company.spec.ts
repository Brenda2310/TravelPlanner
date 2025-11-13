import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCompany } from './reservation-company';

describe('ReservationCompany', () => {
  let component: ReservationCompany;
  let fixture: ComponentFixture<ReservationCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
