import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthRequest,
  AuthResponse,
  RefreshTokenRequest
} from '../../models/security-models';

const API = 'http://localhost:8080/auth';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root'
})

export class SecurityService {
  private http = inject(HttpClient);

  private saveTokens(response: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  public clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  authenticateUser(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API, authRequest).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${API}/refresh`, request).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  logout(): Observable<string> {
    return this.http.post(`${API}/logout`, null, { responseType: 'text' }).pipe(
      tap(() => this.clearTokens())
    );
  }
}
