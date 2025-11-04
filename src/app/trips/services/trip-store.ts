import { inject, Injectable, signal } from '@angular/core';
import { PagedModel, Pageable, CollectionState, PaginationInfo } from '../../hateoas/hateoas-models';
import { Observable, tap } from 'rxjs';
import {
  TripCreateDTO,
  TripFilterDTO,
  TripResponseDTO,
  TripUpdateDTO,
  RecommendationDTO,
} from '../trip-models';
import { BaseStore } from '../../BaseStore';
import { TripService } from './trip-service';

@Injectable({
  providedIn: 'root'
})
export class TripStore extends BaseStore {
  private readonly client = inject(TripService);
  private readonly _trips = signal<CollectionState<TripResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _recommendations = signal<CollectionState<RecommendationDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _currentTrip = signal<TripResponseDTO | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly trips = this._trips.asReadonly();
  public readonly recommendations = this._recommendations.asReadonly();
  public readonly currentTrip = this._currentTrip.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  private setTrips(list: TripResponseDTO[], page: any) {
      this._trips.set({
        list,
        loading: false,
        pageInfo: {
          totalElements: page.totalElements,
          totalPages: page.totalPages,
          currentPage: page.number,
          pageSize: page.size,
        } as PaginationInfo
      });
    }

    private setRecommendations(list: RecommendationDTO[], page: any) {
        this._recommendations.set({
          list,
          loading: false,
          pageInfo: {
            totalElements: page.totalElements,
            totalPages: page.totalPages,
            currentPage: page.number,
            pageSize: page.size,
          } as PaginationInfo
        });
      }

      loadAllTrips(pageable: Pageable): void {
        this._loading.set(true);
        this.client.getAll(pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<TripResponseDTO>(pagedResponse);
                this.setTrips(list, pagedResponse.page);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load trips.');
                this._loading.set(false);
            },
        });
    }

    loadTripsInactive(pageable: Pageable): void {
        this._loading.set(true);
        this.client.getAllInactive(pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<TripResponseDTO>(pagedResponse);
                this.setTrips(list, pagedResponse.page);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load inactive trips.');
                this._loading.set(false);
            },
        });
    }
    
    loadTripById(id: number): void {
        this._loading.set(true);
        this.client.getById(id).subscribe({
            next: (entityModel) => {
                const trip = (entityModel as any).content || entityModel;
                this._currentTrip.set(trip);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? `Store Error: Failed to load trip ${id}.`);
                this._loading.set(false);
            },
        });
    }

    loadTripsByUserId(userId: number, filters: TripFilterDTO, pageable: Pageable): void {
        this._loading.set(true);
        this.client.getTripsByUserId(userId, filters, pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<TripResponseDTO>(pagedResponse);
                this.setTrips(list, pagedResponse.page);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? `Store Error: Failed to load trips for user ${userId}.`);
                this._loading.set(false);
            },
        });
    }

    loadRecommendations(userId: number, tripId: number, pageable: Pageable): void {
        this._loading.set(true);
        this.client.getRecommendations(userId, tripId, pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<RecommendationDTO>(pagedResponse);
                this.setRecommendations(list, (pagedResponse as PagedModel<RecommendationDTO>).page);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load recommendations.');
                this._loading.set(false);
            },
        });
    }

    loadFilteredRecommendations(userId: number, tripId: number, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getFilteredRecommendations(userId, tripId, pageable).subscribe({
        next: (response) => {
            if (typeof response === 'string') {
                this._error.set(response); 
                
                this.setRecommendations([], { 
                    totalElements: 0, totalPages: 0, number: 0, size: pageable.size 
                } as any); 
            } else {
                const list = this.unwrapEntities<RecommendationDTO>(response);
                this.setRecommendations(list, response.page);
            }
            this._loading.set(false); 
        },
        error: (err) => {
            this._error.set(err.message ?? 'Store Error: Failed to load filtered recommendations.');
            this._loading.set(false);
        },
    });
    }

    createTrip(dto: TripCreateDTO): Observable<TripResponseDTO> {
        return this.client.create(dto).pipe(
            tap(newTrip => {
                this._trips.update(state => ({
                    ...state,
                    list: [newTrip, ...state.list],
                    pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 }
                }));
            })
        );
    }

    updateTrip(id: number, dto: TripUpdateDTO): Observable<TripResponseDTO> {
        return this.client.update(id, dto).pipe(
            tap(updatedTrip => {
                this._trips.update(state => ({
                    ...state,
                    list: state.list.map(t => (t.id === id ? updatedTrip : t))
                }));
                if (this._currentTrip()?.id === id) {
                    this._currentTrip.set(updatedTrip);
                }
            })
        );
    }

    deleteTrip(id: number): Observable<void> {
        return this.client.delete(id).pipe(
            tap(() => {
                this._trips.update(state => ({
                    ...state,
                    list: state.list.filter(t => t.id !== id),
                    pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 }
                }));
            })
        );
    }

    restoreTrip(id: number): Observable<void> {
        return this.client.restore(id).pipe(
            tap(() => {
                console.log(`Trip ${id} restored successfully (needs manual state refresh).`);
            })
        );
    }

    get userTripsList() {
    return this._trips.asReadonly();
    }


}
