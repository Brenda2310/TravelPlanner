import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '../services/user-store';
import { SecurityStore } from '../../security/services/security-store';
import { CommonModule } from '@angular/common';
import { TripStore } from '../../trips/services/trip-store';
import { Pageable } from '../../hateoas/hateoas-models';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly router = inject(Router);
  public readonly userStore = inject(UserStore);
  public readonly securityStore = inject(SecurityStore);
  public readonly store = inject(TripStore);
  public pageable: Pageable = { page: 0, size: 10, sort: 'startDate,desc' };

  @Input() mode: 'admin-all' | 'user-own' = 'user-own';

  loadTrips() {
    if (this.mode === 'admin-all') {
      this.store.loadAllTrips(this.pageable);
    } else {
      const currentUserId = this.securityStore.getId();

      if (currentUserId !== null) {
        const filters = {};
        this.store.loadTripsByUserId(currentUserId, filters, this.pageable);
      } else {
        console.log('Error: Usuario no autenticado.');
      }
    }
  }

  onPageChange(newPage: number): void {
    this.pageable.page = newPage;
    this.loadTrips();
  }

  public currentUser = this.userStore.profile;

  ngOnInit(): void {
    this.userStore.loadProfile();
    this.loadTrips();
  }

  onEditProfile(id: number): void {
    this.router.navigate([`/profile/me/edit`]);
  }

  onDeleteAccount(): void {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userStore.deleteOwnAccount().subscribe({
        next: () => {
          this.securityStore.clearTokens();
          this.router.navigate(['/login']).then(() => {
            setTimeout(() => window.location.reload(), 100);
          });
        },
        error: (err) => {
          console.error('Error al eliminar cuenta:', err);
          alert('Error al eliminar la cuenta');
        },
      });
    }
  }
}
