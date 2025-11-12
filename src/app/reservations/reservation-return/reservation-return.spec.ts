import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationReturn } from './reservation-return';

describe('ReservationReturn', () => {
  let component: ReservationReturn;
  let fixture: ComponentFixture<ReservationReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationReturn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationReturn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
