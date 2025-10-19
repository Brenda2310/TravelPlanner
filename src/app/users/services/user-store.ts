import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '../../BaseStore';
import { UserService } from './user-service';
import { Observable, tap } from 'rxjs';
import { CollectionState, PaginationInfo, Pageable, EntityModel} from '../../hateoas/hateoas-models';
import { UserResponseDTO, UserCreateDTO, UserUpdateDTO } from '../user-models';

@Injectable({
  providedIn: 'root'
})
export class UserStore extends BaseStore {
  private readonly client = inject(UserService);
  private readonly _users = signal<CollectionState<UserResponseDTO>>({
    list: [],
    loading: false,
    pageInfo: { totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
  });

  private readonly _profile = signal<UserResponseDTO | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly users = this._users.asReadonly();
  public readonly profile = this._profile.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  
  private setUsers(list: UserResponseDTO[], page: any) {
    this._users.set({
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

  loadAllUsers(pageable: Pageable): void {
        this._loading.set(true);
        this.client.getAllUsers(pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<UserResponseDTO>(pagedResponse);
                this.setUsers(list, pagedResponse.page);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load all users.');
                this._loading.set(false);
            },
        });
    }

    loadAllUsersInactive(pageable: Pageable): void {
        this._loading.set(true);
        this.client.getAllUsersInactive(pageable).subscribe({
            next: (pagedResponse) => {
                const list = this.unwrapEntities<UserResponseDTO>(pagedResponse);
                this.setUsers(list, pagedResponse.page); 
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load inactive users.');
                this._loading.set(false);
            },
        });
    }
    
    loadProfile(): void {
        this._loading.set(true);
        this.client.getProfile().subscribe({
            next: (entityModel) => {
                const profile = (entityModel as any).content || entityModel;
                this._profile.set(profile);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message ?? 'Store Error: Failed to load profile.');
                this._loading.set(false);
            },
        });
    }

    createUser(user: UserCreateDTO): Observable<EntityModel<UserResponseDTO>> {
        return this.client.createUser(user).pipe(
            tap(entityModel => {
                const newUser = (entityModel as any).content || entityModel;
                
                this._users.update(state => ({
                    ...state,
                    list: [newUser, ...state.list],
                    pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements + 1 }
                }));
            })
        );
    }

    updateUser(id: number, updatedUser: UserUpdateDTO): Observable<EntityModel<UserResponseDTO>> {
        return this.client.updateUser(id, updatedUser).pipe(
            tap(entityModel => {
                const updated = (entityModel as any).content || entityModel;
                
                this._users.update(state => ({
                    ...state,
                    list: state.list.map(u => (u.id === id ? updated : u))
                }));
            })
        );
    }
    
    updateOwnAccount(updatedUser: UserUpdateDTO): Observable<EntityModel<UserResponseDTO>> {
        return this.client.updateOwnAccount(updatedUser).pipe(
            tap(entityModel => {
                const updated = (entityModel as any).content || entityModel;
                
                this._profile.set(updated);

                this._users.update(state => ({
                    ...state,
                    list: state.list.map(u => (u.id === updated.id ? updated : u))
                }));
            })
        );
    }

    assignRole(id: number): Observable<string> {
        return this.client.assignRole(id).pipe(
            tap(() => {
                 console.log(`User ${id} role assigned successfully (needs manual state refresh).`);
            })
        );
    }

    restoreAccount(id: number): Observable<string> {
        return this.client.restoreAccount(id).pipe(
            tap(() => {
                console.log(`User ${id} restored successfully (needs manual state refresh).`);
            })
        );
    }

    deleteOwnAccount(): Observable<string> {
        return this.client.deleteOwnAccount().pipe(
            tap(() => {
                console.log('Own account deleted successfully.');
            })
        );
    }

    deleteUserAdmin(id: number): Observable<string> {
        return this.client.deleteUserAdmin(id).pipe(
            tap(() => {
                this._users.update(state => ({
                    ...state,
                    list: state.list.filter(u => u.id !== id),
                    pageInfo: { ...state.pageInfo, totalElements: state.pageInfo.totalElements - 1 }
                }));
            })
        );
    }
  
}
