import { inject, Injectable, signal } from '@angular/core';
import { ChecklistService } from './checklist-service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { CollectionState, EntityModel, PaginationInfo, Pageable} from '../../hateoas/hateoas-models';
import { 
  CheckListResponseDTO,
  CheckListCreateDTO,
  CheckListUpdateDTO,
  CheckListFilterDTO } from '../checklist-models';
import { BaseStore } from '../../BaseStore';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChecklistStore extends BaseStore{
  private readonly client = inject(ChecklistService);
  private readonly _checklist = signal<CollectionState<CheckListResponseDTO>>({
      list: [], 
      loading: false, 
      pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 }
  });;

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentChecklist = signal<CheckListResponseDTO | null>(null);
  

  public readonly checklist = this._checklist.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly currentChecklist = this._currentChecklist.asReadonly();

  private setChecklist(list: CheckListResponseDTO[], page: any) {
    this._checklist.set({
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

  loadAll(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAll(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CheckListResponseDTO>(pagedResponse);

        this.setChecklist(list, pagedResponse.page);

        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load checklists.');
        this._loading.set(false);
      },
    });
  }

  loadAllActive(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllActive(pageable).subscribe({
      next: (pagedResponse) => {
        console.log(pagedResponse); 
        const list = this.unwrapEntities<CheckListResponseDTO>(pagedResponse);
        this.setChecklist(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load active checklists.');
        this._loading.set(false);
      }
    });
  }


  loadByUser(userId: number, filters: CheckListFilterDTO, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getByUser(userId, filters, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CheckListResponseDTO>(pagedResponse);
        this.setChecklist(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? `Store Error: Failed to load checklists for user ${userId}.`);
        this._loading.set(false);
      },
    });
  }

  loadChecklistById(id: number): void {
    this._loading.set(true);
    this.client.getById(id).subscribe({
      next: (entityModel) => {
        const checklist = (entityModel as any).content || entityModel;
        this._currentChecklist.set(checklist);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? `Store Error: Failed to load checklist ${id}.`);
        this._loading.set(false);
      },
    });
  }

  create(dto: CheckListCreateDTO): Observable<CheckListResponseDTO> {
    return this.client.create(dto).pipe(
      tap((newChecklist) => {
        this._checklist.update((state) => ({
          ...state,
          list: [newChecklist, ...state.list],
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 },
        }));
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al crear la checklist.';
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

  update(id: number, dto: CheckListUpdateDTO): Observable<CheckListResponseDTO> {
    return this.client.update(id, dto).pipe(
      tap((updated) => {
        this._checklist.update((state) => ({
          ...state,
          list: state.list.map((c) => (c.id === id ? updated : c)),
        }));
      }), catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al actualizar la checklist.';
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

  delete(id: number): Observable<void> {
    return this.client.delete(id).pipe(
      tap(() => {
        this._checklist.update((state) => ({
          ...state,
          list: state.list.filter((c) => c.id !== id),
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 },
        }));
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al eliminar la checklist.';
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

  restore(id: number): Observable<void> {
    return this.client.restore(id).pipe(
      tap(() => {
        this.loadAll({ page: 0, size: 10 });
      })
    );
  }
}
