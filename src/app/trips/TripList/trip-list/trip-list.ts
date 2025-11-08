import { Component, inject, Input, OnInit } from '@angular/core';
import { TripStore } from '../../services/trip-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from "../../../hateoas/Pagination/pagination/pagination";
import { SecurityStore } from '../../../security/services/security-store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-list',
  imports: [RouterModule, Pagination, CommonModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})
export class TripList implements OnInit{
  public readonly store = inject(TripStore);
  public readonly router = inject(Router);
  public readonly security = inject(SecurityStore);
  public pageable: Pageable ={page: 0, size: 10, sort: 'startDate,desc'};

  @Input() mode: 'admin-all' | 'user-own' = 'user-own';

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(){
    if(this.mode === "admin-all"){
      this.store.loadAllTrips(this.pageable);
    }
    else{
      const currentUserId = this.security.getId();

        if(currentUserId !== null){
          const filters = {}; 
          this.store.loadTripsByUserId(currentUserId, filters, this.pageable);
        }
        else {
            console.log("Error: Usuario no autenticado.");
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


}
