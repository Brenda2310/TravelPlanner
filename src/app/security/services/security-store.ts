import { inject, Injectable, signal } from '@angular/core';
import { SecurityService } from './security-service';
import { Observable, tap, catchError, EMPTY, throwError } from 'rxjs';
import { AuthResponse, AuthRequest } from '../security-models';
import { HttpErrorResponse } from '@angular/common/http';

interface SessionState {
  isAuthenticated: boolean;
  userRoles: string[];
  userId: number | null;
  isAdmin: boolean;
  isCompany: boolean;
  companyId: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class SecurityStore {
  public readonly client = inject(SecurityService);
  private readonly _auth = signal<SessionState>({
    isAuthenticated: this.client.isAuthenticated(),
    userRoles: this.client.getRoles(),
    userId: this.client.getUserId(),
    isAdmin: this.client.isAdmin(),
    isCompany: this.client.isCompany(),
    companyId: this.client.getCompanyId()
  });

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly auth = this._auth.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();


  private updateSessionState(): void {
    this._auth.set({
      isAuthenticated: this.client.isAuthenticated(),
      userRoles: this.client.getRoles(),
      userId: this.client.getUserId(),
      isAdmin: this.client.isAdmin(),
      isCompany: this.client.isCompany(),
      companyId: this.client.getCompanyId()
    });
  }

  getId(){
    return this.client.getUserId();
  }
  
  authenticateUser(authRequest: AuthRequest): Observable<AuthResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.client.authenticateUser(authRequest).pipe(
      tap(() => {
        this.updateSessionState();
        this._loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => { 
            let errorMessage = 'Error de conexión con el servidor.';
            
            if (err.status === 401 || err.status === 403) {

                errorMessage = 'Credenciales inválidas. Verifique su email y contraseña.'; 
            } else if (err.error && err.error.message) {
                errorMessage = err.error.message;
            }

            this._error.set(errorMessage);
            this._loading.set(false);
            
            return throwError(() => new Error(errorMessage)); 
        })
    );
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    this._loading.set(true);

    return this.client.refreshToken(refreshToken).pipe(
      tap(() => {
        this.updateSessionState();
        this._loading.set(false);
      }),
      catchError((err) => {
        this.client.clearTokens();
        this.updateSessionState();
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  clearTokens(){
    this.client.clearTokens();
  }

  logout(): Observable<string> {
    this._loading.set(true);

    return this.client.logout().pipe(
      tap(() => {
        this.updateSessionState();
        this._loading.set(false);
      }),
      catchError((err) => {
        this.client.clearTokens();
        this.updateSessionState();
        this._loading.set(false);
        return EMPTY;
      })
    );
  }
}
