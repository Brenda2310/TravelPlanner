import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivityStore } from '../services/activity-store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Pageable } from '../../hateoas/hateoas-models';
import { ActivityCategory, CompanyActivityFilterParams } from '../activity-models';
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";
import { CommonModule } from '@angular/common';
import { ActivityList } from "../activity-list/activity-list";
import { ActivityFilters } from "../activity-filters/activity-filters";
import { Router, RouterLink } from '@angular/router';
import { ReservationStore } from '../../reservations/services/reservation-store';
import { ReservationCreateDTO } from '../../reservations/reservation-models';
import { SecurityStore } from '../../security/services/security-store';

@Component({
  selector: 'app-activity-browser',
  standalone: true,
  imports: [ReactiveFormsModule, Pagination, CommonModule, ActivityList, ActivityFilters, RouterLink],
  templateUrl: './activity-browser.html',
  styleUrl: './activity-browser.css'
})
export class ActivityBrowser implements OnInit{
  public readonly store = inject(ActivityStore);
  private readonly fb = inject(FormBuilder); 
  private readonly router = inject(Router);
  private readonly reservationStore = inject(ReservationStore);
  public readonly security = inject(SecurityStore);
  private readonly cdr = inject(ChangeDetectorRef);

  public pageable: Pageable = { page: 0, size: 12, sort: 'date,asc' };
  private loading = this.reservationStore.loading();
  public errorMessage = this.reservationStore.error();

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
        this.loadCompanyActivities();
        this.loadUserActivities();
    }

    loadCompanyActivities(): void {
        const filters: CompanyActivityFilterParams = this.filterForm.value as CompanyActivityFilterParams;
        
        this.store.loadAllCompanyActivities(this.pageable, filters);
    }

    loadUserActivities(): void{
      const userId = this.security.getId();
      if(!userId){
        return;
      }
      this.store.loadActivitiesByUserId(userId, {}, this.pageable);

    }
    
    onApplyFilters(filters: CompanyActivityFilterParams): void {
    this.pageable.page = 0;
    this.store.loadAllCompanyActivities(this.pageable, filters);
  }

    onPageChange(newPage: number): void {
        this.pageable.page = newPage;
        this.loadCompanyActivities();
    }
    
    reservate(activityId: number): void {
      const dto: ReservationCreateDTO = {
            activityId: activityId 
          };

      this.reservationStore.createReservation(dto).subscribe({
        next: (reservation) => {
            console.log('Reserva creada con éxito:', reservation);
            this.router.navigateByUrl('/reservaciones');
            this.cdr.detectChanges();
        },
        error: (err: any) => {
        this.loading = false;

        console.error('Error del Store:', err);

        this.errorMessage =
          err.userMessage ||
          err.original?.error?.message ||
          err.original?.message ||
          err.original?.toString() ||
          'Error desconocido.';
        this.cdr.detectChanges();
      },
    });
    }
}