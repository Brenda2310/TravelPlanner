import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityStore } from '../services/activity-store';
import { CommonModule } from '@angular/common';
import { SecurityStore } from '../../security/services/security-store';

@Component({
  selector: 'app-activity-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-details.html',
  styleUrl: './activity-details.css'
})
export class ActivityDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly store = inject(ActivityStore);
  public readonly security = inject(SecurityStore);

  public currentActivityDetail = this.store.currentActivity; 

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const activityId = +idParam;
            this.store.loadById(activityId); 
        }
    }
    
    onBookActivity(): void {
        const activity = this.currentActivityDetail();
        if (activity) {
            alert(`Iniciando proceso de reserva para ${activity.name}.`);
            // Lógica de navegación a ReservationCreateComponent
        }
    }

    toEdit(id: number){
        this.router.navigateByUrl(`/activities/${id}/edit`);
    }
}
