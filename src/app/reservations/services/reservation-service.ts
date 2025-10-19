import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedModel, Pageable } from '../../hateoas/hateoas-models';
import { 
  ReservationResponseDTO,
  ReservationCreateDTO }
   from '../reservation-models'; 
import { BaseService } from '../../BaseService';

@Injectable({
  providedIn: 'root'
})

export class ReservationService extends BaseService{
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/reservation';

  createReservation(dto: ReservationCreateDTO){
    return this.http.post<ReservationResponseDTO>(`${this.api}`, dto);
  }

  confirmPayment(externalReference: number, paymentId: number, pageable: Pageable) {
    const params = this.buildParams(pageable)
      .set('external_reference', externalReference.toString())
      .set('payment_id', paymentId.toString());

    return this.http.get(`${this.api}/confirmar-pago`, { params, responseType: 'text' });
  }

  cancelReservation(id: number) {
    return this.http.put<void>(`${this.api}/${id}/cancel`, null); 
  }

  getAllReservations(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${this.api}`, { params });
  }

  getMyReservations(pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${this.api}/my`, { params });
  }

  getReservationsByCompany(companyId: number, pageable: Pageable) {
    const params = this.buildParams(pageable);
    return this.http.get<PagedModel<ReservationResponseDTO>>(`${this.api}/company/${companyId}`, { params });
  }
}
