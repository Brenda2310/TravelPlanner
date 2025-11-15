import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
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
} from '../../activities/activity-models';
import { BaseService } from '../../BaseService';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/activities';

  createFromUser(dto: UserActivityCreateDTO, pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.post<ActivityCreateResponseDTO>(`${this.api}/user`, dto, { params }).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  createActivityFromCompany(dto: CompanyActivityCreateDTO) {
    return this.http.post<ActivityCompanyResponseDTO>(`${this.api}/company`, dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAllActivities(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityResponseDTO>>(`${this.api}`, { params });
  }

  getAllActivitiesInactive(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getByCompanyId(companyId: number, pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityCompanyResponseDTO>>(
      `${this.api}/company/${companyId}`,
      { params }
    );
  }

  getAllActivitiesCompany(pageable: Pageable, filters: CompanyActivityFilterParams) {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ActivityCompanyResponseDTO>>(`${this.api}/company`, { params });
  }

  getActivityById(id: number) {
    return this.http.get<EntityModel<ActivityResponseDTO>>(`${this.api}/${id}`);
  }

  getActivitiesByUserId(userId: number, filters: ActivityFilterDTO, pageable: Pageable) {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ActivityCreateResponseDTO>>(`${this.api}/user/${userId}`, {
      params,
    });
  }

  updateUserActivity(id: number, dto: ActivityUpdateDTO) {
    return this.http.put<ActivityCreateResponseDTO>(`${this.api}/${id}`, dto);
  }

  updateCompanyActivity(companyId: number, activityId: number, dto: CompanyActivityUpdateDTO) {
    return this.http.put<ActivityResponseDTO>(
      `${this.api}/company/${companyId}/activities/${activityId}`,
      dto
    );
  }

  deleteUserActivity(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  restoreUserActivity(id: number) {
    return this.http.put<void>(`${this.api}/restore/${id}`, null);
  }

  deleteCompanyActivity(companyId: number, activityId: number) {
    return this.http.delete<void>(`${this.api}/company/${companyId}/${activityId}`);
  }

  restoreCompanyActivity(companyId: number, activityId: number) {
    return this.http.put<void>(`${this.api}/company/${companyId}/${activityId}/restore`, null);
  }
}
