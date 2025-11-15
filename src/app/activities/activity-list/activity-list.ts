import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivityCompanyResponseDTO, ActivityCreateResponseDTO, ActivityResponseDTO, ActivityUpdateDTO } from '../activity-models';
import { ActivityCard } from "../activity-card/activity-card";
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";
import { Router } from '@angular/router';
import { ReservationStore } from '../../reservations/services/reservation-store';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [ActivityCard],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css'
})
export class ActivityList {
  private readonly router = inject(Router);
  private readonly reservationStore = inject(ReservationStore);

  @Input() activities: any[] = []; 
  @Input() type: 'user' | 'company' = 'company';

  @Output() reservate = new EventEmitter<number>();

  toDetails(id: number){
    this.router.navigateByUrl(`/activities/${id}`);
  }

  onReservate(activityId: number) {
    this.reservationStore.createReservation({ activityId }).subscribe({
      next: (reservation) => {
       window.location.href = reservation.urlPayment;
      },
      error: (err) => console.error('Error al crear reserva:', err),
    });
  }
}