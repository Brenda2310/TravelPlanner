
export type UserPreference =
  | 'CULTURAL'
  | 'HISTORIC'
  | 'RELIGION'
  | 'NATURAL'
  | 'BEACHES'
  | 'SPORT'
  | 'FOODS'
  | 'ADULT'
  | 'SHOPS'
  | 'AMUSEMENTS'
  | 'ARCHITECTURE'
  | 'INDUSTRIAL_FACILITIES'
  | 'VIEW_POINTS'
  | 'WAYS'
  | 'OTHER';

/**
 * Representa el resumen de un viaje asociado a un usuario.
 * Corresponde a TripResumeDTO en Java.
 */
export interface TripResumeDTO {
  id: number;
  name: string;
  destination: string;
  active: boolean;
}

/**
 * Representa la respuesta completa de la API para un usuario.
 * Corresponde a UserResponseDTO en Java.
 */
export interface UserResponseDTO {
  id: number;
  username: string;
  dni: string;
  fechaRegistro: string; 
  preferencias: UserPreference[]; 
  active: boolean;
  destinos: TripResumeDTO[]; 
}

/**
 * Representa los datos necesarios para crear un nuevo usuario.
 * Corresponde a UserCreateDTO en Java. Todos los campos son requeridos.
 */
export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  dni: string;
  preferencias: UserPreference[]; 
}

/**
 * Representa los datos para actualizar un usuario.
 * Todos los campos son opcionales para permitir actualizaciones parciales,
 * crucial para el endpoint /me/update.
 * Corresponde a UserUpdateDTO en Java.
 */
export interface UserUpdateDTO {
  username?: string;
  email?: string;
  password?: string;
  dni?: string;
  preferencias?: UserPreference[]; 
}