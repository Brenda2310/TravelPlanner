import { Component, inject, OnInit } from '@angular/core';
import { TripStore } from '../../services/trip-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from "../../../hateoas/Pagination/pagination/pagination";

@Component({
  selector: 'app-trip-list',
  imports: [RouterModule, Pagination],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})
export class TripList implements OnInit{
  public readonly store = inject(TripStore);
  public readonly router = inject(Router);
  public pageable: Pageable ={page: 0, size: 10, sort: 'startDate,desc'};

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(){
    this.store.loadAllTrips(this.pageable);
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

}
