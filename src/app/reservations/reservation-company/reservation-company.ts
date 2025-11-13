import { Component, inject, OnInit } from '@angular/core';
import { ReservationStore } from '../services/reservation-store';
import { Pageable } from '../../hateoas/hateoas-models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-company.html',
  styleUrl: './reservation-company.css'
})
export class ReservationCompany implements OnInit {
  private readonly store = inject(ReservationStore);
  private readonly route = inject(ActivatedRoute);

  reservations = this.store.reservation;
  loading = this.store.loading;
  error = this.store.error;

  public companyId: number | null = null;;

  pageable: Pageable = { page: 0, size: 10, sort: 'id,desc' };

  ngOnInit() {
    const companyIdStr = this.route.snapshot.paramMap.get('companyId');
    
    if (companyIdStr) {
      const id = parseInt(companyIdStr, 10);
      
      if (!isNaN(id) && id > 0) {
        this.companyId = id;
        this.loadReservations(); 
        return; 
      }
    }
    console.error('ID de compañía inválido o ausente en la ruta.');
  }

  loadReservations() {
    if (this.companyId !== null) {
      this.store.loadReservationsByCompany(this.companyId, this.pageable);
    }
  }

  onCancelReservation(reservationId: number) {
    this.store.cancelReservation(reservationId).subscribe();
  }

}
