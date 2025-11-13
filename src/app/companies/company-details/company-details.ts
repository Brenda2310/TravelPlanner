import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyStore } from '../services/company-store';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-company-details',
  imports: [],
  templateUrl: './company-details.html',
  styleUrl: './company-details.css'
})
export class CompanyDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(CompanyStore); 

  public company = this.store.currentCompany; 
  public loading = this.store.loading; 
  public error = this.store.error; 

}
