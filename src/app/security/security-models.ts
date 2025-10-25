export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthRequest {
  username: string;
  password: string; 
}

export interface AuthResponse {
  AccessToken: string;
  RefreshToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userRoles: string[];
  userId: number | null;
  username: string | null;
}