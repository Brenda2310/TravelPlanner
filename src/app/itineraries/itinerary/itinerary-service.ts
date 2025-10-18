import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedModel, EntityModel, Pageable } from '../../hateoas/hateoas-models';
import { 
  ItineraryCreateDTO,
  ItineraryFilterDTO,
  ItineraryResponseDTO,
  ItineraryUpdateDTO } 
  from '../itinerary-models'; 
import { BaseService } from '../../BaseService';

@Injectable({
  providedIn: 'root'
})

export class ItineraryService extends BaseService{
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/itineraries';

  createItinerary(dto: ItineraryCreateDTO){
    return this.http.post<ItineraryResponseDTO>(this.api, dto);
  }

  getAllItineraries(pageable: Pageable){
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(this.api, { params });
  }

  getAllItinerariesInactive(pageable: Pageable){
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(`${this.api}/inactive`, { params });
  }

  getItineraryById(id: number){
    return this.http.get<EntityModel<ItineraryResponseDTO>>(`${this.api}/${id}`);
  }

  getItinerariesByUserId(userId: number, filters: ItineraryFilterDTO, pageable: Pageable){
    const params = this.buildParams(pageable, filters);
    return this.http.get<PagedModel<ItineraryResponseDTO>>(`${this.api}/user/${userId}`, { params });
  }

  updateItinerary(id: number, dto: ItineraryUpdateDTO){
    return this.http.put<ItineraryResponseDTO>(`${this.api}/${id}`, dto);
  }

  deleteItinerary(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`); 
  }

  restoreItinerary(id: number) {
    return this.http.put<void>(`${this.api}/restore/${id}`, null); 
  }
}
