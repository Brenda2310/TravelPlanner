import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '../../BaseStore';
import { ItineraryService } from './itinerary-service';
import { Observable, tap, catchError, EMPTY, throwError, finalize } from 'rxjs';
import { CollectionState, PaginationInfo, Pageable } from '../../hateoas/hateoas-models';
import {
  ItineraryCreateDTO,
  ItineraryFilterDTO,
  ItineraryResponseDTO,
  ItineraryUpdateDTO,
} from '../itinerary-models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ItineraryStore extends BaseStore {
  private readonly client = inject(ItineraryService);
  private readonly _itinerary = signal<CollectionState<ItineraryResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentItinerary = signal<ItineraryResponseDTO | null>(null);

  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly itinerary = this._itinerary.asReadonly();
  public readonly currentItinerary = this._currentItinerary.asReadonly();

  private setItinerary(list: ItineraryResponseDTO[], page: any) {
    this._itinerary.set({
      list,
      loading: false,
      pageInfo: {
        totalElements: page.totalElements,
        totalPages: page.totalPages,
        currentPage: page.number,
        pageSize: page.size,
      } as PaginationInfo,
    });
  }

  loadAllItineraries(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllItineraries(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ItineraryResponseDTO>(pagedResponse);
        this.setItinerary(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all itineraries.');
        this._loading.set(false);
      },
    });
  }

  loadAllItinerariesInactive(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllItinerariesInactive(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ItineraryResponseDTO>(pagedResponse);
        this.setItinerary(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load inactive itineraries.');
        this._loading.set(false);
      },
    });
  }

  loadItineraryById(id: number): void {
    this._loading.set(true);
    this.client.getItineraryById(id).subscribe({
      next: (entityModel) => {
        const itinerary = (entityModel as any).content || entityModel;        
        this._currentItinerary.set(itinerary);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? `Store Error: Failed to load itinerary ${id}.`);
        this._loading.set(false);
      },
    });
  }

  loadItinerariesByUserId(userId: number, filters: ItineraryFilterDTO, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getItinerariesByUserId(userId, filters, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ItineraryResponseDTO>(pagedResponse);
        this.setItinerary(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(
          err.message ?? `Store Error: Failed to load itineraries for user ${userId}.`
        );
        this._loading.set(false);
      },
    });
  }

  createItinerary(dto: ItineraryCreateDTO): Observable<ItineraryResponseDTO> {
    this._loading.set(true);
    return this.client.createItinerary(dto).pipe(
      tap((newItinerary) => {
        this._itinerary.update((state) => ({
          ...state,
          list: [newItinerary, ...state.list],
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al crear el Itinerario.';
        if (err.error && typeof err.error === 'object') {
          userMessage = err.error.message || err.error.error || userMessage;
        } else if (typeof err.error === 'string') {
          userMessage = err.error;
        } else if (err.status) {
          if (err.status === 404) userMessage = 'El recurso solicitado no fue encontrado.';
          else if (err.status === 403)
            userMessage = 'Acceso denegado. No tiene permisos para esta acción.';
        }

        this._error.set(userMessage);
        return throwError(() => ({ userMessage, original: err }));
      }),
      finalize(() => {
        this._loading.set(false);
      })
  )}

  updateItinerary(id: number, dto: ItineraryUpdateDTO): Observable<ItineraryResponseDTO> {
    this._loading.set(true);
    return this.client.updateItinerary(id, dto).pipe(
      tap((updatedItinerary) => {
        this._itinerary.update((state) => ({
          ...state,
          list: state.list.map((i) => (i.id === id ? updatedItinerary : i)),
        }));
        if (this._currentItinerary()?.id === id) {
          this._currentItinerary.set(updatedItinerary);
        }
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al crear el Itinerario.';
        if (err.error && typeof err.error === 'object') {
          userMessage = err.error.message || err.error.error || userMessage;
        } else if (typeof err.error === 'string') {
          userMessage = err.error;
        } else if (err.status) {
          if (err.status === 404) userMessage = 'El recurso solicitado no fue encontrado.';
          else if (err.status === 403)
            userMessage = 'Acceso denegado. No tiene permisos para esta acción.';
        }

        this._error.set(userMessage);
        return throwError(() => ({ userMessage, original: err }));
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  deleteItinerary(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.deleteItinerary(id).pipe(
      tap(() => {
        this._itinerary.update((state) => ({
          ...state,
          list: state.list.filter((i) => i.id !== id),
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to delete itinerary.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  restoreItinerary(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.restoreItinerary(id).pipe(
      tap(() => {
        console.log(`Itinerary ${id} restored successfully.`);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to restore itinerary.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }
}
