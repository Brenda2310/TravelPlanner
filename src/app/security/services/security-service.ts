import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, Observable, of, take, tap, throwError } from 'rxjs';
import { AuthRequest, AuthResponse, RefreshTokenRequest } from '../security-models';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root',
})

export class SecurityService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/auth';

  private isRefreshing = false;
  private readonly refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  public refreshAccessToken(): Observable<string | null> {
    if (this.isRefreshing) {
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            map(() => this.getValidAccessToken())
        );
    }
    
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null); 

    const refreshTokenValue = this.getRefreshToken();

    if (!refreshTokenValue) {
        this.clearTokens();
        this.isRefreshing = false;
        return of(null);
    }

    return this.refreshToken(refreshTokenValue).pipe( 
        map(response => {
            const newAccessToken = (response as any).AccessToken;
            this.isRefreshing = false;
            this.refreshTokenSubject.next(newAccessToken);
            return newAccessToken;
        }),
        catchError((error) => {
            this.clearTokens();
            this.isRefreshing = false;
            this.refreshTokenSubject.next(null);
            return throwError(() => error); 
        })
    );
}

  public getAccessToken(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = this.decodeJwt(token);
    const rawId = decoded?.userId || decoded?.sub || decoded?.id; 

    if (rawId) {
        return parseInt(rawId, 10); 
    }
    return null;
}

private isTokenExpired(payload: any): boolean {
  if (!payload || !payload.exp) return true;
  const now = Date.now() / 1000;
  return payload.exp < now; 
}

public getValidAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  const payload = this.decodeJwt(token);

  if (this.isTokenExpired(payload)) {
    return null; 
  }
  return token;
}

private decodeJwt(token: string): any {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT:', e);
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
