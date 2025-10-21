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