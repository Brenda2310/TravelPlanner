import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, EMPTY, finalize, throwError } from 'rxjs';
import { BaseStore } from '../../BaseStore';
import { Pageable, CollectionState, PaginationInfo } from '../../hateoas/hateoas-models';
import {
  ExpenseResponseDTO,
  ExpenseResumeDTO,
  ExpenseCreateDTO,
  ExpenseUpdateDTO,
  ExpenseFilterDTO,
  ExpenseCategory,
} from '../expense-models';
import { ExpenseService } from './expense-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseStore extends BaseStore {
  private readonly client = inject(ExpenseService);
  private readonly _expenses = signal<CollectionState<ExpenseResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });
  private readonly _expense = signal<CollectionState<ExpenseResumeDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _currentExpenseDetail = signal<ExpenseResumeDTO | null>(null);
  private readonly _calculations = signal<{
    average: number | null;
    realAverage: number | null;
    total: number | null;
    realTotal: number | null;
  }>({
    average: null,
    realAverage: null,
    total: null,
    realTotal: null,
  });

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly expenses = this._expenses.asReadonly();
  public readonly expense = this._expense.asReadonly();
  public readonly currentExpenseDetail = this._currentExpenseDetail.asReadonly();
  public readonly calculations = this._calculations.asReadonly();

  private setExpenses(list: ExpenseResponseDTO[], page: any) {
    this._expenses.set({
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

  private setExpense(list: ExpenseResumeDTO[], page: any) {
    this._expense.set({
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

  loadAllExpenses(pageable: Pageable, category?: ExpenseCategory): void {
    this._loading.set(true);
    this.client.getAllExpenses(pageable, category).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ExpenseResponseDTO>(pagedResponse);
        this.setExpenses(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all expenses.');
        this._loading.set(false);
      },
    });
  }

  loadExpensesInactive(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllExpensesInactive(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ExpenseResponseDTO>(pagedResponse);
        this.setExpenses(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load inactive expenses.');
        this._loading.set(false);
      },
    });
  }

  loadExpensesByUserId(userId: number, filters: ExpenseFilterDTO, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getExpensesByUserId(userId, filters, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ExpenseResumeDTO>(pagedResponse);
        this.setExpense(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load user expenses.');
        this._loading.set(false);
      },
    });
  }

  loadExpensesByTripId(tripId: number, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getExpensesByTripId(tripId, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<ExpenseResumeDTO>(pagedResponse);
        this.setExpense(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load trip expenses.');
        this._loading.set(false);
      },
    });
  }

  loadExpenseById(id: number): void {
    this._loading.set(true);
    this.client.getExpenseById(id).subscribe({
      next: (entityModel) => {
        const expense = (entityModel as any).content || entityModel;
        this._currentExpenseDetail.set(expense);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? `Store Error: Failed to load expense ${id}.`);
        this._loading.set(false);
      },
    });
  }

  loadAverageExpensesByUser(userId: number): void {
    this.client.getAverageExpensesByUser(userId).subscribe({
      next: (avg) => this._calculations.update((c) => ({ ...c, average: avg })),
      error: (err) => console.error('Error fetching average expenses:', err),
    });
  }

  loadRealAverageExpenseByUser(userId: number): void {
    this.client.getRealAverageExpenseByUser(userId).subscribe({
      next: (avg) => this._calculations.update((c) => ({ ...c, realAverage: avg })),
      error: (err) => console.error('Error fetching real average expenses:', err),
    });
  }

  loadTotalExpensesByTrip(tripId: number): void {
    this.client.getTotalExpensesByTrip(tripId).subscribe({
      next: (total) => this._calculations.update((c) => ({ ...c, realTotal: total })),
      error: (err) => console.error('Error fetching total expenses by trip:', err),
    });
  }

  loadTotalRealExpensesByUser(userId: number): void {
    this.client.getTotalRealExpensesByUser(userId).subscribe({
      next: (total) => this._calculations.update((c) => ({ ...c, realTotal: total })),
      error: (err) => console.error('Error fetching total real expenses by user:', err),
    });
  }

  loadAverageExpensesByTrip(tripId: number): void {
    this.client.getAverageExpensesByTrip(tripId).subscribe({
      next: (avg) => this._calculations.update((c) => ({ ...c, average: avg })),
      error: (err) => console.error('Error fetching average expenses by trip:', err),
    });
  }

  createExpense(dto: ExpenseCreateDTO): Observable<ExpenseResponseDTO> {
    this._loading.set(true);
    return this.client.createExpense(dto).pipe(
      tap((newExpense) => {
        this._expense.update((state) => ({
          ...state,
          list: [newExpense, ...state.list],
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al crear el gasto.';
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

  updateExpense(id: number, dto: ExpenseUpdateDTO): Observable<ExpenseResumeDTO> {
    this._loading.set(true);
    return this.client.updateExpense(id, dto).pipe(
      tap((updatedExpense) => {
        this._expense.update((state) => ({
          ...state,
          list: state.list.map((e) => (e.id === id ? updatedExpense : e)),
        }));
        if (this._currentExpenseDetail()?.id === id) {
          this._currentExpenseDetail.set(updatedExpense);
        }
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al actualizar el gasto.';
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

  deleteExpense(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.deleteExpense(id).pipe(
      tap(() => {
        this._expense.update((state) => ({
          ...state,
          list: state.list.filter((e) => +e.id !== +id),
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to delete expense.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  restoreExpense(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.restoreExpense(id).pipe(
      tap(() => {
        console.log(`Expense ${id} restored successfully.`);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to restore expense.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }
}
