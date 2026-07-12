export enum ApiStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ApiErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTH_EXPIRATION = "AUTH_EXPIRATION",
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_FORBIDDEN = "AUTH_FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export interface ApiResponse<Data=unknown> {
  success: true
  message?: string
  data: Data
  meta?: unknown
}

export interface ZodFieldError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  success: false
  status: ApiStatusCode
  code: ApiErrorCode
  message: string
  details?: ZodFieldError[]
}

export type ApiResult<Data = unknown> = ApiResponse<Data> | ApiError
