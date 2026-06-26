/**
 * core/types — Tipos globales compartidos por toda la aplicación.
 * Solo tipos que NO pertenecen a una feature específica.
 */

/** Respuesta genérica paginada del API */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Respuesta de error estándar del API */
export interface ApiError {
  message: string;
  statusCode: number;
}
