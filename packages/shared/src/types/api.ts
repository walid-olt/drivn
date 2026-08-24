/**
 * Error responses mirror better-auth's `APIError` payload shape
 * (`{ message, code?, ... }`) so server and client can share one type
 * without maintaining custom status/code enums here.
 */
export interface ApiError {
	success: false;
	status: number;
	message: string;
	code?: string;
	details?: ZodFieldError[];
}

export interface ApiResponse<Data = unknown> {
	success: true;
	message?: string;
	data: Data;
	meta?: unknown;
}

export interface ZodFieldError {
	field: string;
	message: string;
	code: string;
}

export type ApiResult<Data = unknown> = ApiResponse<Data> | ApiError;
