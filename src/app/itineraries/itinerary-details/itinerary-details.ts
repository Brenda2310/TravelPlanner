import { Component, effect, inject, signal } from '@angular/core';
import { ItineraryStore } from '../services/itinerary-store';
import { ActivatedRoute, Router } from '@angular/router';
import { TripDetails } from '../../trips/tripDetails/trip-details/trip-details';
import { TripStore } from '../../trips/services/trip-store';

@Component({
  selector: 'app-itinerary-details',
  standalone: true,
  imports: [],
  templateUrl: './itinerary-details.html',
  styleUrl: './itinerary-details.css'
})

export class ItineraryDetails {
  public readonly store = inject(ItineraryStore);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly trips = inject(TripStore);

  public itineraryId: number | null = null;
  public currentIt$ = this.store.currentItinerary;
  public currentTrip$ = this.trips.currentTrip;

  ngOnInit(): void{
    const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.itineraryId = +id;
        this.store.loadItineraryById(this.itineraryId);
    }
  }

  private readonly loadTripEffect = effect(() => {
    const itinerary = this.currentIt$();
    if (itinerary) {
      this.trips.loadTripById(itinerary.tripId);
    }
  });

  onDeleteItinerary(): void {
      if (this.itineraryId && confirm('¿Desea eliminar este Itinerario?')) {
        this.store.deleteItinerary(this.itineraryId).subscribe({
          next: () => this.router.navigate(['itineraries']),
        });
      }
    }

  toEdit(id: number){
    this.router.navigateByUrl(`/itineraries/${id}/edit`);
  }
}
