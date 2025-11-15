import { Component, inject, OnInit } from '@angular/core';
import { ReservationStore } from '../services/reservation-store';
import { Pageable } from '../../hateoas/hateoas-models';
import { CommonModule } from '@angular/common';
import { ReservationResponseDTO } from '../reservation-models';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.css'
})
export class ReservationList implements OnInit{
  private readonly store = inject(ReservationStore);

  reservations = this.store.reservation;
  loading = this.store.loading;
  error = this.store.error;

  pageable: Pageable = { page: 0, size: 10, sort: 'id,desc' };

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.store.loadMyReservations(this.pageable);
  }

  onCancelReservation(reservationId: number) {
    this.store.cancelReservation(reservationId).subscribe();
  }

  onPay(reservation: ReservationResponseDTO) {
    if (reservation.urlPayment) {
      window.location.href = reservation.urlPayment;
    } else {
      
      this.store.payReservation(reservation.id).subscribe();
    }
  }

  pedirPaymentId(): number {
    const input = prompt("Pegá acá el ID de la operacion que le dio Mercado Pago:");
    return input ? Number(input) : 0;
  }


  onConfirmPayment(reservationId: number, paymentId: number) {
  this.store.confirmPayment(reservationId, paymentId, this.pageable).subscribe();
}

}
