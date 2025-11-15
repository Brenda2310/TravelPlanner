import { Component, inject, Input, OnInit } from '@angular/core';
import { TripStore } from '../../services/trip-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from "../../../hateoas/Pagination/pagination/pagination";
import { SecurityStore } from '../../../security/services/security-store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';               
import { TripFilterDTO } from '../../trip-models';          

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [RouterModule, Pagination, CommonModule, FormsModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})
export class TripList implements OnInit {
  public readonly store = inject(TripStore);
  public readonly router = inject(Router);
  public readonly security = inject(SecurityStore);
  public pageable: Pageable = { page: 0, size: 9, sort: 'startDate,desc' };

  @Input() mode: 'admin-all' | 'user-own' = 'user-own';

  public filters: TripFilterDTO = {
    destination: '',
    startDate: '',
    endDate: ''
  };

  ngOnInit(): void {
    if (this.security.auth().isAdmin) {
      this.mode = 'admin-all';
    } else {
      this.mode = 'user-own';
    }
    this.loadTrips();
  }

  loadTrips(): void {
    if (this.mode === 'admin-all') {
      this.store.loadAllTrips(this.pageable);
    } else {
      const currentUserId = this.security.getId();

      if (currentUserId !== null) {
        this.store.loadTripsByUserId(currentUserId, this.filters, this.pageable);
      } else {
        console.log('Error: Usuario no autenticado.');
      }
    }
  }

  onPageChange(newPage: number): void {
    this.pageable.page = newPage;
    this.loadTrips();
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de eliminar este viaje?')) {
      this.store.deleteTrip(id).subscribe({
        error: (err) => console.error('Error al eliminar viaje:', err)
      });
    }
  }

  isTripFinished(trip: any): boolean {
    const today = new Date();
    const end = new Date(trip.endDate);
    return end < today;
  }

  onApplyFilters(): void {
    this.pageable.page = 0;
    this.loadTrips();
  }

  onClearFilters(): void {
    this.filters = {
      destination: '',
      startDate: '',
      endDate: ''
    };
    this.pageable.page = 0;
    this.loadTrips();
  }
}
