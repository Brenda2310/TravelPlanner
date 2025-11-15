import { Component, inject, Input, OnInit } from '@angular/core';
import { ItineraryStore } from '../services/itinerary-store';
import { SecurityStore } from '../../security/services/security-store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Pageable } from '../../hateoas/hateoas-models';
import { ItineraryFilterDTO } from '../itinerary-models';
import { Router, RouterLink } from "@angular/router";
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";
import { TripStore } from '../../trips/services/trip-store';

@Component({
  selector: 'app-itinerary-list',
  imports: [ReactiveFormsModule, RouterLink, Pagination],
  templateUrl: './itinerary-list.html',
  styleUrl: './itinerary-list.css'
})
export class ItineraryList implements OnInit{
  public readonly store = inject(ItineraryStore);
  private readonly security = inject(SecurityStore);
  private readonly fb = inject(FormBuilder);
  public readonly router = inject(Router);
  private readonly tripStore = inject(TripStore);                    

  public pageable: Pageable = { page: 0, size: 9, sort: 'itineraryDate,asc' };

  public userTrips = this.tripStore.trips;
  @Input() mode: 'admin-all' | 'user-own' = 'user-own';
    
  public filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      tripId: ['']
  });

  ngOnInit(): void {
    if(this.security.auth().isAdmin){
      this.mode = 'admin-all';
    }
    else{
      this.mode = 'user-own';
      const userId = this.security.getId();
    if (userId) {
      this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 100 } as Pageable);
    }
    }
    this.loadItineraries();
  }

  loadItineraries(){
    if(this.mode === 'admin-all'){
      const userId = this.security.getId();
    if(!userId){
      console.error('User not authenticated for loading itineraries.');
      return;
    }

    const filters: ItineraryFilterDTO = this.filterForm.value as ItineraryFilterDTO;

    this.store.loadAllItineraries(this.pageable);
    }
    else{
      const userId = this.security.getId();
    if(!userId){
      console.error('User not authenticated for loading itineraries.');
      return;
    }

    const filters: ItineraryFilterDTO = this.filterForm.value as ItineraryFilterDTO;

    this.store.loadItinerariesByUserId(userId, filters, this.pageable);
    }
  }

  onApplyFilters(): void {
      this.pageable.page = 0;
      this.loadItineraries();
  }

  onPageChange(newPage: number): void {
      this.pageable.page = newPage;
      this.loadItineraries();
  }

  onDelete(id: number): void {
      if (confirm('¿Confirmar eliminación de itinerario (borrado lógico)?')) {
          this.store.deleteItinerary(id).subscribe({
              error: (err) => console.error('Error al eliminar itinerario:', err)
        });
      }
    }

  toDetails(id: number){
    this.router.navigateByUrl(`/itineraries/${id}`);
  }

  clearFilters(): void {
    this.filterForm.reset({ dateFrom: '', dateTo: '', tripId: '' });
    this.pageable.page = 0;
    this.loadItineraries();
  }

}
