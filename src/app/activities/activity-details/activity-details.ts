import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityStore } from '../services/activity-store';
import { CommonModule } from '@angular/common';
import { SecurityStore } from '../../security/services/security-store';
import { ReservationCreateDTO } from '../../reservations/reservation-models';
import { ReservationStore } from '../../reservations/services/reservation-store';

@Component({
  selector: 'app-activity-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-details.html',
  styleUrl: './activity-details.css',
})
export class ActivityDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly store = inject(ActivityStore);
  public readonly security = inject(SecurityStore);
  public readonly reservationStore = inject(ReservationStore);

  public currentActivityDetail = this.store.currentActivity;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const activityId = +idParam;
      console.log("DECODED TOKEN", this.security.client.decodeJwt(this.security.client.getAccessToken()!));
      console.log("userId: " + this.security.auth().userId + " CompanyId: " + this.security.auth().companyId);
      this.store.loadById(activityId);
    }
  }

  /*onBookActivity(): void {
    const activity = this.currentActivityDetail();
    if (activity) {
      alert(`Iniciando proceso de reserva para ${activity.name}.`);
      const dto: ReservationCreateDTO = {
        activityId: activity.id,
      };

      this.reservationStore.createReservation(dto).subscribe({
        next: (reservation) => {
          console.log('Reserva creada con éxito:', reservation);
          this.router.navigateByUrl('/reservaciones');
        },
        error: (err) => {
          console.error('Error al intentar crear reserva:', err);
        },
      });
    }
  }*/

    onBookActivity(): void {
    const activity = this.currentActivityDetail();
    if (!activity) return;

    const dto: ReservationCreateDTO = { activityId: activity.id };

    this.reservationStore.createReservation(dto).subscribe({
      next: (reservation) => {
        window.location.href = reservation.urlPayment;
      },
      error: (err) => console.error('Error al crear reserva:', err),
    });
  }

  toEdit(id: number) {
    this.router.navigateByUrl(`/activities/${id}/edit`);
  }
}
