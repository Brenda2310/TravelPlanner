import { inject, Injectable, signal } from '@angular/core';
import { ChecklistItemService } from './checklist-item-service';
import { Observable, tap } from 'rxjs';
import {
  CollectionState,
  EntityModel,
  Pageable,
  PaginationInfo,
} from '../../../hateoas/hateoas-models';
import {
  CheckListItemResponseDTO,
  CheckListItemFilterDTO,
  CheckListItemUpdateDTO,
  CheckListItemCreateDTO,
} from '../../checklist-models';
import { BaseStore } from '../../../BaseStore';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemStore extends BaseStore {
  private readonly client = inject(ChecklistItemService);
  private readonly _checklistItem = signal<CollectionState<CheckListItemResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly checklistItem = this._checklistItem.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  private setChecklistItems(list: CheckListItemResponseDTO[], page: any) {
    this._checklistItem.set({
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

  loadAllItems(pageable: Pageable, completed?: boolean): void {
    this._loading.set(true);
    this.client.getAll(pageable, completed).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CheckListItemResponseDTO>(pagedResponse);

        this.setChecklistItems(list, pagedResponse.page);

        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Store Error: Failed to load all checklist items.');
        this._loading.set(false);
      },
    });
  }

  loadItemsByUserId(userId: number, filters: CheckListItemFilterDTO, pageable: Pageable): void {
    this._loading.set(true);
    this.client.getItemsByUserId(userId, filters, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CheckListItemResponseDTO>(pagedResponse);

        this.setChecklistItems(list, pagedResponse.page);

        this._loading.set(false);
      },
      error: (err) => {
        console.error(`Store Error: Failed to load items for user ${userId}.`, err);
        this._loading.set(false);
      },
    });
  }

  loadItemsByChecklistId(checklistId: number, pageable: Pageable): void {

    this._loading.set(true);
    this.client.getByChecklistId(checklistId, pageable).subscribe({
      next: (pagedResponse) => {
        const list = this.unwrapEntities<CheckListItemResponseDTO>(pagedResponse);
        this.setChecklistItems(list, pagedResponse.page);
        this._loading.set(false);
      },
      error: (err) => {
        console.error(`Store Error: Failed to load items for checklist ${checklistId}.`, err);
        this._loading.set(false);
      },
    });
  }

  createItem(dto: CheckListItemCreateDTO): Observable<CheckListItemResponseDTO> {
    return this.client.create(dto).pipe(
      tap((newItem) => {
        this._checklistItem.update((state) => ({
          ...state,
          list: [newItem, ...state.list],
          pageInfo: {
            ...state.pageInfo,
            totalElements: state.pageInfo.totalElements + 1,
          },
        }));
      })
    );
  }

  updateItem(id: number, dto: CheckListItemUpdateDTO): Observable<CheckListItemResponseDTO> {
    return this.client.update(id, dto).pipe(
      tap((updatedItem) => {
        this._checklistItem.update((state) => ({
          ...state,
          list: state.list.map((item) => (item.id === id ? updatedItem : item)),
        }));
      })
    );
  }

  toggleItemCompleted(id: number, completed: boolean): Observable<CheckListItemResponseDTO> {
    return this.client.toggleCompleted(id, completed).pipe(
      tap((toggledItem) => {
        this._checklistItem.update((state) => ({
          ...state,
          list: state.list.map((item) => (item.id === id ? toggledItem : item)),
        }));
      })
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.client.delete(id).pipe(
      tap(() => {
        this._checklistItem.update((state) => ({
          ...state,
          list: state.list.filter((item) => item.id !== id),
          pageInfo: {
            ...state.pageInfo,
            totalElements: state.pageInfo.totalElements - 1,
          },
        }));
      })
    );
  }
}
