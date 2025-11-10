import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCreateEdit } from './company-create-edit';

describe('CompanyCreateEdit', () => {
  let component: CompanyCreateEdit;
  let fixture: ComponentFixture<CompanyCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
