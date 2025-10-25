import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceSelector } from './preference-selector';

describe('PreferenceSelector', () => {
  let component: PreferenceSelector;
  let fixture: ComponentFixture<PreferenceSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
