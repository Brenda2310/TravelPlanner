import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPublicProfile } from './company-public-profile';

describe('CompanyPublicProfile', () => {
  let component: CompanyPublicProfile;
  let fixture: ComponentFixture<CompanyPublicProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPublicProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPublicProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
