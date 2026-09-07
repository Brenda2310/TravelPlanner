import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pageable } from '../../hateoas/hateoas-models';
import { ReservationStore } from '../services/reservation-store';

@Component({
  selector: 'app-reservation-return',
  standalone: true,
  imports: [],
  templateUrl: './reservation-return.html',
  styleUrl: './reservation-return.css',
})
export class ReservationReturn implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ReservationStore);
  private readonly router = inject(Router);

  pageable: Pageable = { page: 0, size: 10, sort: 'id,desc' };

  status = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal<string>('');

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const paymentId = params['payment_id'];
      const externalReference = params['external_reference'];

      if (!paymentId || !externalReference) {
        this.status.set('error');
        this.errorMessage.set('Faltan datos del pago en la URL de retorno.');
        return;
      }

      this.store.confirmPayment(+externalReference, +paymentId, this.pageable).subscribe({
        next: () => {
          this.status.set('success');
          setTimeout(() => this.goToReservations(), 1500);
        },
        error: (err) => {
          this.status.set('error');
          this.errorMessage.set(
            err?.error?.message || 'No se pudo confirmar el pago. Contactá a soporte si el dinero fue descontado.'
          );
        },
      });
    });
  }

  goToReservations(): void {
    this.router.navigate(['/reservations']);
  }
}