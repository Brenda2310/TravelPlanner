import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);

  private loading = this.reservationStore.loading();
  public errorMessage = this.reservationStore.error();

  public currentActivityDetail = this.store.currentActivity;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const activityId = +idParam;
      this.store.loadById(activityId);
    }
  }

    onBookActivity(): void {
    const activity = this.currentActivityDetail();
    if (!activity) return;

    const dto: ReservationCreateDTO = { activityId: activity.id };

    this.reservationStore.createReservation(dto).subscribe({
      next: (reservation) => {
        window.location.href = reservation.urlPayment;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;

        console.error('Error del Store:', err);

        this.errorMessage =
          err.userMessage ||
          err.original?.error?.message ||
          err.original?.message ||
          err.original?.toString() ||
          'Error desconocido.';
        this.cdr.detectChanges();
      },
    });
  }

  toEdit() {
    this.router.navigateByUrl(`/activities/${this.currentActivityDetail()?.id}/edit`);
  }

  onDelete() {
  if (!confirm("¿Seguro que querés eliminar esta actividad?")) return;

  const activity = this.currentActivityDetail();
  if (!activity) return;

  const id = activity.id;

  if (activity.companyId) {
    this.store.deleteCompanyActivity(activity.companyId, id).subscribe({
      next: () => {
        alert("Actividad eliminada con éxito.");
        this.router.navigateByUrl('/activities');
      },
      error: (err) => {
        this.errorMessage = err.userMessage || 'Error al eliminar actividad.';
      }
    });

    return;
  }
  this.store.deleteUserActivity(id).subscribe({
    next: () => {
      alert("Actividad eliminada con éxito.");
      this.router.navigateByUrl('/activities');
    },
    error: (err) => {
      this.errorMessage = err.userMessage || 'Error al eliminar actividad.';
    }
  });
}


}
