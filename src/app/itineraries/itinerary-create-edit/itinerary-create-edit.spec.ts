import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryCreateEdit } from './itinerary-create-edit';

describe('ItineraryCreateEdit', () => {
  let component: ItineraryCreateEdit;
  let fixture: ComponentFixture<ItineraryCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
