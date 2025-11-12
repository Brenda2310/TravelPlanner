import { inject, Injectable, signal } from '@angular/core';
import { ReservationService } from './reservation-service';
import { CollectionState, PaginationInfo, Pageable } from '../../hateoas/hateoas-models';
import { Observable, tap, catchError, EMPTY } from 'rxjs';
import { ReservationResponseDTO, ReservationCreateDTO } from '../reservation-models';
import { BaseStore } from '../../BaseStore';

@Injectable({
  providedIn: 'root',
})
export class ReservationStore extends BaseStore {
  private readonly client = inject(ReservationService);
  private readonly _reservation = signal<CollectionState<ReservationResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly reservation = this._reservation.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  private setReservation(list: ReservationResponseDTO[], page: any) {
    this._reservation.set({
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

  loadAllReservations(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllReservations(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ReservationResponseDTO>(pagedResponse);
        this.setReservation(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all reservations.');
        this._loading.set(false);
      },
    });
  }

  loadMyReservations(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getMyReservations(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ReservationResponseDTO>(pagedResponse);
        this.setReservation(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load user reservations.');
        this._loading.set(false);
      },
    });
  }

  loadReservationsByCompany(companyId: number, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getReservationsByCompany(companyId, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ReservationResponseDTO>(pagedResponse);
        this.setReservation(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load company reservations.');
        this._loading.set(false);
      },
    });
  }

  createReservation(dto: ReservationCreateDTO): Observable<ReservationResponseDTO> {
    this._loading.set(true);
    return this.client.createReservation(dto).pipe(
      tap((newReservation) => {
        this._reservation.update((state) => ({
          ...state,
          list: [newReservation, ...state.list],
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to create reservation.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  confirmPayment(
    externalReference: number,
    paymentId: number,
    pageable: Pageable
  ): Observable<string> {
    this._loading.set(true);
    return this.client.confirmPayment(externalReference, paymentId, pageable).pipe(
      tap((message) => {
        this._reservation.update((state) => ({
          ...state,
          list: state.list.map((r) =>
            r.id === externalReference ? { ...r, paid: true, status: 'PAID' as any } : r
          ),
        }));
        this.loadMyReservations(pageable);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Payment confirmation failed.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  cancelReservation(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.cancelReservation(id).pipe(
      tap(() => {
        this._reservation.update((state) => ({
          ...state,
          list: state.list.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' as any } : r)),
        }));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to cancel reservation.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }
}
