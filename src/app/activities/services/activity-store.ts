import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ActivityService } from './activity-service';
import { Observable, tap } from 'rxjs';
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
import { BaseStore } from '../../BaseStore';

@Injectable({
  providedIn: 'root',
})
export class ActivityStore extends BaseStore{
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

  private readonly _currentActivity = signal<ActivityResponseDTO | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly activities = this._activities.asReadonly();
  public readonly companyActivities = this._companyActivities.asReadonly();
  public readonly userActivities = this._userActivities.asReadonly();
  public readonly currentActivity = this._currentActivity.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  private updateStateTotals(signal: WritableSignal<any>, increment: number): void {
    signal.update(state => ({
        ...state,
        pageInfo: { 
            ...state.pageInfo, 
            totalElements: state.pageInfo.totalElements + increment 
        }
    }));
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
            this._loading.set(false);
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
            this._loading.set(false);
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
            this._loading.set(false);
      },
      error: (err) => {
        console.error(`Store Error: Failed to load activities for user ${userId}.`, err);
        this._loading.set(false);
      },
    });
  }

  loadById(id: number){
    this._loading.set(true);
    this.client.getActivityById(id).subscribe({
      next: (entityModel) => {
        const activity = (entityModel as any).content || entityModel;
            this._currentActivity.set(activity);
            this._loading.set(false);
      },
      error: (err) => {
        console.error(`Store Error: Failed to load activity with id ${id}`, err);
        this._loading.set(false);
      },
    });
  }

 createFromUser(
    dto: UserActivityCreateDTO,
    pageable: Pageable
): Observable<ActivityCreateResponseDTO> {
    this._loading.set(true); 
    return this.client.createFromUser(dto, pageable).pipe(
        tap((newActivity) => {
            this._userActivities.update(state => ({
                ...state,
                list: [newActivity, ...state.list],
                loading: false
            }));
            this.updateStateTotals(this._userActivities as any, 1);
        })
    );
}
  createActivityFromCompany(dto: CompanyActivityCreateDTO): Observable<ActivityCompanyResponseDTO> {
    this._loading.set(true);
    return this.client.createActivityFromCompany(dto).pipe(
        tap((newActivity) => {
            this._companyActivities.update(state => ({
                ...state,
                list: [newActivity, ...state.list],
                loading: false
            }));
            this.updateStateTotals(this._companyActivities as any, 1);
        })
    );
}

  updateUserActivity(id: number, dto: ActivityUpdateDTO): Observable<ActivityCreateResponseDTO> {
    this._loading.set(true);
    return this.client.updateUserActivity(id, dto).pipe(
        tap((updatedActivity) => {
            this._userActivities.update(state => ({
                ...state,
                list: state.list.map(a => (a.id === id ? updatedActivity : a)),
                loading: false
            }));
        })
    );
}

  updateCompanyActivity(id: number, idActivity: number, dto: CompanyActivityUpdateDTO): Observable<ActivityResponseDTO> {
    this._loading.set(true);
    return this.client.updateCompanyActivity(id, idActivity, dto).pipe(
        tap((updatedActivity) => {
            this._companyActivities.update(state => ({
                ...state,
                list: state.list.map(a => (a.id === idActivity ? updatedActivity as any : a)),
                loading: false
            }));
        })
    );
}

  deleteUserActivity(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.deleteUserActivity(id).pipe(
        tap(() => {
            this._userActivities.update(state => ({
                ...state,
                list: state.list.filter(a => a.id !== id),
                loading: false
            }));
            this.updateStateTotals(this._userActivities as any, -1);
        })
    );
}

deleteCompanyActivity(companyId: number, activityId: number): Observable<void> {
    this._loading.set(true);
    return this.client.deleteCompanyActivity(companyId, activityId).pipe(
        tap(() => {
            this._companyActivities.update(state => ({
                ...state,
                list: state.list.filter(a => a.id !== activityId),
                loading: false
            }));
            this.updateStateTotals(this._companyActivities as any, -1);
        })
    );
}
}
