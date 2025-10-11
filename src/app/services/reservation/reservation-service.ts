import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedModel, EntityModel, Pageable } from '../../models/hateoas-models';
import {
  ReservationResponseDTO,
  ReservationCreateDTO
} from '../../models/reservation-models';

const API = 'http://localhost:8080/reservation'; 

@Injectable({
  providedIn: 'root'
})

export class ReservationService {
  private http = inject(HttpClient);

  private buildParams(pageable: Pageable): HttpParams {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    return params;
  }

  createReservation(dto: ReservationCreateDTO): Observable<ReservationResponseDTO> {
    return this.http.post<ReservationResponseDTO>(`${API}`, dto);
  }

  confirmPayment(externalReference: number, paymentId: number, pageable: Pageable): Observable<string> {
    const params = this.buildParams(pageable)
      .set('external_reference', externalReference.toString())
      .set('payment_id', paymentId.toString());

    return this.http.get(`${API}/confirmar-pago`, { params, responseType: 'text' });
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.put<void>(`${API}/${id}/cancel`, null); // Returns 200 OK or 204 No Content
  }

  getAllReservations(pageable: Pageable): Observable<PagedModel<ReservationResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${API}`, { params });
  }

  getMyReservations(pageable: Pageable): Observable<PagedModel<ReservationResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${API}/my`, { params });
  }

  getReservationsByCompany(companyId: number, pageable: Pageable): Observable<PagedModel<ReservationResponseDTO>> {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${API}/company/${companyId}`, { params });
  }
}
