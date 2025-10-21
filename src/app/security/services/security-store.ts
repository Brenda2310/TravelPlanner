import { inject, Injectable, signal } from '@angular/core';
import { SecurityService } from './security-service';
import { Observable, tap, catchError, EMPTY } from 'rxjs';
import { AuthResponse, AuthRequest } from '../security-models';

interface SessionState {
  isAuthenticated: boolean;
  userRoles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SecurityStore {
  private readonly client = inject(SecurityService);
  private readonly _auth = signal<SessionState>({
    isAuthenticated: this.client.isAuthenticated(),
    userRoles: [],
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
    });
  }

  authenticateUser(authRequest: AuthRequest): Observable<AuthResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.client.authenticateUser(authRequest).pipe(
      tap(() => {
        this.updateSessionState();
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set(err.message ?? 'Authentication failed. Check credentials.');
        this._loading.set(false);
        return EMPTY;
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
