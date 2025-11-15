import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '../../BaseStore';
import { CompanyService } from './company-service';
import { Observable, tap, catchError, EMPTY, throwError, finalize } from 'rxjs';
import { CollectionState, PaginationInfo, Pageable, EntityModel } from '../../hateoas/hateoas-models';
import { CompanyResponseDTO, CompanyCreateDTO, CompanyUpdateDTO } from '../company-models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyStore extends BaseStore {
  private readonly client = inject(CompanyService);
  private readonly _companies = signal<CollectionState<CompanyResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _currentCompany = signal<CompanyResponseDTO | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly companies = this._companies.asReadonly();
  public readonly currentCompany = this._currentCompany.asReadonly();

  private setCompany(list: CompanyResponseDTO[], page: any) {
    this._companies.set({
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

  loadAllCompanies(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllCompanies(pageable).subscribe({
      next: (pagedResponse) => {
        this.setCompany(this.unwrapEntities<CompanyResponseDTO>(pagedResponse), pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all companies.');
        this._loading.set(false);
      },
    });
  }

  loadAllCompaniesInactive(pageable: Pageable): void {
    this._loading.set(true);
    this.client.getAllCompaniesInactive(pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CompanyResponseDTO>(pagedResponse);
        this.setCompany(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load inactive companies.');
        this._loading.set(false);
      },
    });
  }

  loadCompanyById(id: number): void {
    this._loading.set(true);
    this.client.getCompanyById(id).subscribe({
      next: (entityModel) => {
        const company = (entityModel as any).content || entityModel;
        this._currentCompany.set(company);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? `Store Error: Failed to load company ${id}.`);
        this._loading.set(false);
      },
    });
  }

  loadProfile(): void {
    this._loading.set(true);
    this.client.getProfile().subscribe({
      next: (entityModel) => {
        const profile = (entityModel as any).content || entityModel;
        this._currentCompany.set(profile);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load company profile.');
        this._loading.set(false);
      },
    });
  }

  createCompany(dto: CompanyCreateDTO): Observable<EntityModel<CompanyResponseDTO>> {
    this._loading.set(true);
    return this.client.createCompany(dto).pipe(
      tap((entityModel) => {
        const newCompany = (entityModel as any).content || entityModel;

        this._companies.update((state) => ({
          ...state,
          list: [newCompany, ...state.list],
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        let userMessage = 'Error desconocido al crear la actividad.';
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

  updateCompany(id: number, dto: CompanyUpdateDTO): Observable<EntityModel<CompanyResponseDTO>> {
    this._loading.set(true);
    return this.client.updateCompany(id, dto).pipe(
      tap((entityModel) => {
        const updated = (entityModel as any).content || entityModel;

        this._companies.update((state) => ({
          ...state,
          list: state.list.map((c) => (c.id === id ? updated : c)),
        }));
        if (this._currentCompany()?.id === id) {
          this._currentCompany.set(updated);
        }
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to update company.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  deleteCompany(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.deleteCompany(id).pipe(
      tap(() => {
        this._companies.update((state) => ({
          ...state,
          list: state.list.filter((c) => c.id !== id),
          pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 },
        }));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to delete company.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  deleteOwnCompany(): Observable<void> {
    this._loading.set(true);
    return this.client.deleteOwnCompany().pipe(
      tap(() => {
        this._currentCompany.set(null);
        this._loading.set(false);
        console.log('Own company deleted successfully (requires re-authentication logic).');
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to delete own company account.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  restoreCompany(id: number): Observable<void> {
    this._loading.set(true);
    return this.client.restoreCompany(id).pipe(
      tap(() => {
        console.log(`Company ${id} restored successfully.`);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Store Error: Failed to restore company.');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }
}
