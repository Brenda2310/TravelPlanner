import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import {
  ActivityResponseDTO,
  ActivityCreateResponseDTO,
  ActivityCompanyResponseDTO,
  UserActivityCreateDTO,
  CompanyActivityCreateDTO,
  ActivityUpdateDTO,
  CompanyActivityUpdateDTO,
  ActivityFilterDTO,
  CompanyActivityFilterParams
} from '../../models/activity-models';

const API = 'http://localhost:8080/activities';


@Injectable({
  providedIn: 'root'
})

export class ActivityService {
  private http = inject(HttpClient);

  private buildParams(pageable: Pageable, filters: any = {}): HttpParams {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null) {
        params = params.set(key, filters[key].toString());
      }
    }
    return params;
  }

  createFromUser(dto: UserActivityCreateDTO, pageable: Pageable): Observable<ActivityCreateResponseDTO> {
    const params = this.buildParams(pageable);
    return this.http.post<ActivityCreateResponseDTO>(`${API}/user`, dto, { params });
  }

  createActivityFromCompany(dto: CompanyActivityCreateDTO): Observable<ActivityCompanyResponseDTO> {
    return this.http.post<ActivityCompanyResponseDTO>(`${API}/company`, dto);
  }

  getAllActivities(pageable: Pageable): Observable<PagedModel<ActivityResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityResponseDTO>>(`${API}`, { params });
  }

  getAllActivitiesInactive(pageable: Pageable): Observable<PagedModel<ActivityResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityResponseDTO>>(`${API}/inactive`, { params });
  }

  getByCompanyId(companyId: number, pageable: Pageable): Observable<PagedModel<ActivityCompanyResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ActivityCompanyResponseDTO>>(`${API}/company/${companyId}`, { params });
  }

  getAllActivitiesCompany(pageable: Pageable, filters: CompanyActivityFilterParams): Observable<PagedModel<ActivityCompanyResponseDTO>> {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ActivityCompanyResponseDTO>>(`${API}/company`, { params });
  }

  getActivityById(id: number): Observable<EntityModel<ActivityResponseDTO>> {
    return this.http.get<EntityModel<ActivityResponseDTO>>(`${API}/${id}`);
  }

  getActivitiesByUserId(userId: number, filters: ActivityFilterDTO, pageable: Pageable): Observable<PagedModel<ActivityCreateResponseDTO>> {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ActivityCreateResponseDTO>>(`${API}/user/${userId}`, { params });
  }

  updateUserActivity(id: number, dto: ActivityUpdateDTO): Observable<ActivityCreateResponseDTO> {
    return this.http.put<ActivityCreateResponseDTO>(`${API}/${id}`, dto);
  }

  updateCompanyActivity(companyId: number, activityId: number, dto: CompanyActivityUpdateDTO): Observable<ActivityResponseDTO> {
    return this.http.put<ActivityResponseDTO>(`${API}/company/${companyId}/activities/${activityId}`, dto);
  }

  deleteUserActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }

  restoreUserActivity(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null);
  }

  deleteCompanyActivity(companyId: number, activityId: number): Observable<void> {
    return this.http.delete<void>(`${API}/company/${companyId}/${activityId}`);
  }

  restoreCompanyActivity(companyId: number, activityId: number): Observable<void> {
    return this.http.put<void>(`${API}/company/${companyId}/${activityId}/restore`, null);
  }
}
