import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  ActivityCompanyResponseDTO,
  ActivityCreateResponseDTO,
  ActivityFilterDTO,
  ActivityResponseDTO,
  ActivityUpdateDTO,
  CompanyActivityCreateDTO,
  CompanyActivityFilterParams,
  CompanyActivityUpdateDTO,
  UserActivityCreateDTO,
} from '../../activities/activity-models';
import { BaseService } from '../../BaseService';
import { EntityModel, Pageable, PagedModel } from '../../hateoas/hateoas-models';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/activities';

  createFromUser(dto: UserActivityCreateDTO, pageable: Pageable, file?: File) {
    const params = this.buildParams(pageable);
    const formData = new FormData();
    formData.append('activity', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http
      .post<ActivityCreateResponseDTO>(`${this.api}/user`, formData, { params })
      .pipe(catchError((err) => throwError(() => err)));
  }

  createActivityFromCompany(dto: CompanyActivityCreateDTO, file?: File) {
    const formData = new FormData();
    formData.append('activity', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http
      .post<ActivityCompanyResponseDTO>(`${this.api}/company`, formData)
      .pipe(catchError((err) => throwError(() => err)));
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
      { params },
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

  updateUserActivity(id: number, dto: ActivityUpdateDTO, file?: File) {
    const formData = new FormData();
    formData.append('activity', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http.put<ActivityCreateResponseDTO>(`${this.api}/${id}`, formData);
  }

  updateCompanyActivity(
    companyId: number,
    activityId: number,
    dto: CompanyActivityUpdateDTO,
    file?: File,
  ) {
    const formData = new FormData();
    formData.append('activity', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http.put<ActivityResponseDTO>(
      `${this.api}/company/${companyId}/activities/${activityId}`,
      formData,
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
