import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationStore } from '../services/reservation-store';
import { Pageable } from '../../hateoas/hateoas-models';

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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const paymentId = params['payment_id'];
      const externalReference = params['external_reference'];

      if (paymentId && externalReference) {
        this.store.confirmPayment(+externalReference, +paymentId, this.pageable).subscribe(() => {
          setTimeout(() => this.router.navigate(['/reservations']), 1500);
        });
      }
    });
  }
}
