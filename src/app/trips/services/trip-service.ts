import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BaseService } from '../../BaseService';
import { EntityModel, Pageable, PagedModel } from '../../hateoas/hateoas-models';
import {
  RecommendationDTO,
  TripCreateDTO,
  TripFilterDTO,
  TripResponseDTO,
  TripUpdateDTO,
} from '../trip-models';

@Injectable({
  providedIn: 'root',
})
export class TripService extends BaseService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/trips';

  getAll(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<TripResponseDTO>>(`${this.api}`, { params });
  }

  getAllInactive(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<TripResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getById(id: number) {
    return this.http.get<EntityModel<TripResponseDTO>>(`${this.api}/${id}`);
  }

  create(dto: TripCreateDTO) {
    return this.http.post<TripResponseDTO>(this.api, dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  update(id: number, dto: TripUpdateDTO) {
    return this.http.put<TripResponseDTO>(`${this.api}/${id}`, dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  restore(id: number) {
    return this.http.put<void>(`${this.api}/restore/${id}`, null);
  }

  getTripsByUserId(userId: number, filters: TripFilterDTO, pageable: Pageable) {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<TripResponseDTO>>(`${this.api}/user/${userId}`, { params });
  }

  getRecommendations(userId: number, tripId: number, pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<RecommendationDTO>>(
      `${this.api}/${userId}/${tripId}/recommendations`,
      { params },
    );
  }

  getFilteredRecommendations(userId: number, tripId: number, pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<RecommendationDTO> | string>(
      `${this.api}/${userId}/${tripId}/recommendations/filtered`,
      { params },
    );
  }
}
