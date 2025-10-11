import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import { 
  ItineraryCreateDTO,
  ItineraryFilterDTO,
  ItineraryResponseDTO,
  ItineraryUpdateDTO
 } from '../../models/itinerary-models';

 const API = 'http://localhost:8080/itineraries'; 

@Injectable({
  providedIn: 'root'
})

export class ItineraryService {
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

  createItinerary(dto: ItineraryCreateDTO): Observable<ItineraryResponseDTO> {
    return this.http.post<ItineraryResponseDTO>(API, dto);
  }

  getAllItineraries(pageable: Pageable): Observable<PagedModel<ItineraryResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(API, { params });
  }

  getAllItinerariesInactive(pageable: Pageable): Observable<PagedModel<ItineraryResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(`${API}/inactive`, { params });
  }

  getItineraryById(id: number): Observable<EntityModel<ItineraryResponseDTO>> {
    return this.http.get<EntityModel<ItineraryResponseDTO>>(`${API}/${id}`);
  }

  getItinerariesByUserId(userId: number, filters: ItineraryFilterDTO, pageable: Pageable): Observable<PagedModel<ItineraryResponseDTO>> {
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(`${API}/user/${userId}`, { params });
  }

  updateItinerary(id: number, dto: ItineraryUpdateDTO): Observable<ItineraryResponseDTO> {
    return this.http.put<ItineraryResponseDTO>(`${API}/${id}`, dto);
  }

  deleteItinerary(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`); 
  }

  restoreItinerary(id: number): Observable<void> {
    return this.http.put<void>(`${API}/restore/${id}`, null); 
  }
}
