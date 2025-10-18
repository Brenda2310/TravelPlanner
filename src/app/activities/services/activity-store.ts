import { inject, Injectable, signal } from '@angular/core';
import { ActivityService } from './activity-service';
import { Observable } from 'rxjs';
import { Pageable, CollectionState, EntityModel, PaginationInfo } from '../../hateoas/hateoas-models';
import {
  ActivityResponseDTO,
  ActivityCreateResponseDTO,
  ActivityCompanyResponseDTO,
  UserActivityCreateDTO,
  CompanyActivityCreateDTO,
  ActivityUpdateDTO,
  CompanyActivityUpdateDTO,
  ActivityFilterDTO,
  CompanyActivityFilterParams,
} from '../activity-models';

@Injectable({
  providedIn: 'root',
})
export class ActivityStore {
  private readonly client = inject(ActivityService);
  private readonly _activities = signal<CollectionState<ActivityResponseDTO>>({
      list: [], 
      loading: false, 
      pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 }
  });;

  private readonly _companyActivities = signal<CollectionState<ActivityCompanyResponseDTO>>({
      list: [], 
      loading: false, 
      pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 }
  });;

  private readonly _userActivities = signal<CollectionState<ActivityCreateResponseDTO>>({
      list: [], 
      loading: false, 
      pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 }
  });;

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly activities = this._activities.asReadonly();
  public readonly companyActivities = this._companyActivities.asReadonly();
  public readonly userActivities = this._userActivities.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  private unwrapEntities<T>(pagedResponse: { _embedded?: any }): T[] {
    return ((Object.values(pagedResponse._embedded ?? {})[0] as EntityModel<T>[] | undefined) ?? [])
      .map(e => e.content ?? e) as T[];
  }

  loadAllActivities(pageable: Pageable) {
    this._loading.set(true);
    this.client.getAllActivities(pageable).subscribe({
      next: (pagedResponse) => {
            const list = this.unwrapEntities<ActivityResponseDTO>(pagedResponse);

            this._activities.set({
                list: list, 
                loading: false,
                pageInfo: {
                    totalElements: pagedResponse.page.totalElements,
                    totalPages: pagedResponse.page.totalPages,
                    currentPage: pagedResponse.page.number,
                    pageSize: pagedResponse.page.size,
                } as PaginationInfo 
            });
          },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all activities.');
        this._loading.set(false);
      },
    });
  }

  loadAllCompanyActivities(pageable: Pageable, filters: CompanyActivityFilterParams) {
    this._loading.set(true);
    this.client.getAllActivitiesCompany(pageable, filters).subscribe({
      next: (pagedResponse) => {
        const embedded = pagedResponse._embedded as any;
            const list = this.unwrapEntities<ActivityCompanyResponseDTO>(pagedResponse);

            this._companyActivities.set({
                list: list, 
                loading: false,
                pageInfo: {
                    totalElements: pagedResponse.page.totalElements,
                    totalPages: pagedResponse.page.totalPages,
                    currentPage: pagedResponse.page.number,
                    pageSize: pagedResponse.page.size,
                } as PaginationInfo 
            });
      },
      error: (err) => {
        console.error('Store Error: Failed to load company activities.', err);
        this._loading.set(false);
      },
    });
  }

  loadActivitiesByUserId(userId: number, filters: ActivityFilterDTO, pageable: Pageable) {
    this._loading.set(true);
    this.client.getActivitiesByUserId(userId, filters, pageable).subscribe({
      next: (pagedResponse) => {
        const embedded = pagedResponse._embedded as any;
            const list = this.unwrapEntities<ActivityCreateResponseDTO>(pagedResponse);

            this._userActivities.set({
                list: list, 
                loading: false,
                pageInfo: {
                    totalElements: pagedResponse.page.totalElements,
                    totalPages: pagedResponse.page.totalPages,
                    currentPage: pagedResponse.page.number,
                    pageSize: pagedResponse.page.size,
                } as PaginationInfo 
            });
      },
      error: (err) => {
        console.error(`Store Error: Failed to load activities for user ${userId}.`, err);
        this._loading.set(false);
      },
    });
  }

  createFromUser(
    dto: UserActivityCreateDTO,
    pageable: Pageable
  ): Observable<ActivityCreateResponseDTO> {
    return this.client.createFromUser(dto, pageable);
  }

  createActivityFromCompany(dto: CompanyActivityCreateDTO): Observable<ActivityCompanyResponseDTO> {
    return this.client.createActivityFromCompany(dto);
  }

  deleteUserActivity(id: number): Observable<void> {
    return this.client.deleteUserActivity(id);
  }

  updateUserActivity(id: number, dto: ActivityUpdateDTO): Observable<ActivityCreateResponseDTO> {
    return this.client.updateUserActivity(id, dto);
  }

  updateCompanyActivity(id: number, idActivity: number, dto: CompanyActivityUpdateDTO): Observable<ActivityResponseDTO> {
    return this.client.updateCompanyActivity(id, idActivity, dto);
  }

  deleteCompanyActivity(companyId: number, activityId: number): Observable<void> {
    return this.client.deleteCompanyActivity(companyId, activityId);
  }
}
