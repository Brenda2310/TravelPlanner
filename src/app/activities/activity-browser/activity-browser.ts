import { Component, inject, OnInit } from '@angular/core';
import { ActivityStore } from '../services/activity-store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Pageable } from '../../hateoas/hateoas-models';
import { ActivityCategory, CompanyActivityFilterParams } from '../activity-models';
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";
import { CommonModule } from '@angular/common';
import { ActivityList } from "../activity-list/activity-list";
import { ActivityFilters } from "../activity-filters/activity-filters";

@Component({
  selector: 'app-activity-browser',
  standalone: true,
  imports: [ReactiveFormsModule, Pagination, CommonModule, ActivityList, ActivityFilters],
  templateUrl: './activity-browser.html',
  styleUrl: './activity-browser.css'
})
export class ActivityBrowser implements OnInit{
  public readonly store = inject(ActivityStore);
  private readonly fb = inject(FormBuilder); 

  public pageable: Pageable = { page: 0, size: 12, sort: 'date,asc' };

  public readonly category: ActivityCategory[] = ['AVENTURA', 'CULTURA', 'RELAX', 'GASTRONOMIA', 'NATURALEZA', 'NIGHTLIFE', 'SHOPPING', 
  'DEPORTES', 'HISTORIA', 'FAMILIA'];

  public filterForm = this.fb.group({
        category: [''],
        startDate: [''],
        endDate: [''],
        minPrice: [null],
        maxPrice: [null],
        availableQuantity: [null],
    });

  ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        const filters: CompanyActivityFilterParams = this.filterForm.value as CompanyActivityFilterParams;
        
        this.store.loadAllCompanyActivities(this.pageable, filters);
    }
    
    onApplyFilters(filters: CompanyActivityFilterParams): void {
    this.pageable.page = 0;
    this.store.loadAllCompanyActivities(this.pageable, filters);
  }

    onPageChange(newPage: number): void {
        this.pageable.page = newPage;
        this.loadActivities();
    }
    
    onAddToItinerary(activityId: number): void {
        console.log(`Activity ${activityId} added to itinerary.`);
    }
}
