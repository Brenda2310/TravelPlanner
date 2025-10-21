import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthRequest, AuthResponse, RefreshTokenRequest } from '../security-models';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root',
})

export class SecurityService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/auth';

  public saveTokens(response: AuthResponse): void {
    const accessToken = (response as any).AccessToken;
    const refreshToken = response.RefreshToken;
    
    if (!accessToken) return;
  
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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

private decodeJwt(token: string): any {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (err) {
    console.error('JWT decode error', err);
    return null;
  }
}

getRoles(): string[] {
  const token = this.getAccessToken();
  if (!token) return [];
  
  const decoded = this.decodeJwt(token);
  return decoded?.roles || [];
}


  authenticateUser(authRequest: AuthRequest) {
    return this.http
      .post<AuthResponse>(this.api, authRequest, {headers: { 'Content-Type': 'application/json' }})
      .pipe(tap((response) => this.saveTokens(response)));
  }

  refreshToken(refreshToken: string) {
    const request: RefreshTokenRequest = { refreshToken };
    return this.http
      .post<AuthResponse>(`${this.api}/refresh`, request)
      .pipe(tap((response) => this.saveTokens(response)));
  }

  logout(){
    return this.http
      .post(`${this.api}/logout`, null, { responseType: 'text' })
      .pipe(tap(() => this.clearTokens()));
  }
}
