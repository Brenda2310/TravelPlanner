import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import { 
TripCreateDTO,
TripFilterDTO,
TripResponseDTO,
TripResumeDTO,
TripUpdateDTO,
RecommendationDTO } from '../../models/trip-models';

const API = 'http://localhost:8080/trips'; 

@Injectable({
  providedIn: 'root'
})
export class TripService {
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

  getAll(pageable: Pageable): Observable<PagedModel<TripResponseDTO>>{
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<TripResponseDTO>>(`${API}`, {params});
  }

  getAllInactive(pageable: Pageable): Observable<PagedModel<TripResponseDTO>>{
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<TripResponseDTO>>(`${API}/inactive`, {params});
  }

  getById(id: number): Observable<EntityModel<TripResponseDTO>> {
    return this.http.get<EntityModel<TripResponseDTO>>(`${API}/${id}`);
  }

  create(dto: TripCreateDTO): Observable<TripResponseDTO> {
    return this.http.post<TripResponseDTO>(API, dto);
  }

  update(id: number, dto: TripUpdateDTO): Observable<TripResponseDTO> {
    return this.http.put<TripResponseDTO>(`${API}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); 
  }

  restore(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null);
  }

  getTripsByUserId(userId: number, filters: TripFilterDTO, pageable: Pageable): Observable<PagedModel<TripResponseDTO>> {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<TripResponseDTO>>(`${API}/user/${userId}`, { params });
  }

  getRecommendations(userId: number, tripId: number, pageable: Pageable): Observable<PagedModel<RecommendationDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<RecommendationDTO>>(`${API}/${userId}/${tripId}/recommendations`, { params });
  }

  getFilteredRecommendations(userId: number, tripId: number, pageable: Pageable): Observable<PagedModel<RecommendationDTO> | string> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<RecommendationDTO> | string>(`${API}/${userId}/${tripId}/recommendations/filtered`, { params });
  }
}
