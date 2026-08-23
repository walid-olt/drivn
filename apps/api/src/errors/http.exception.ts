import { APIError } from 'better-auth';
import type { ZodFieldError } from '@drivn/shared';
import jwt from 'jsonwebtoken';

// destructure the specific error classes from the jwt module because they are not exported directly from the module
const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jwt;

/**
 * Error factories built on top of better-auth's `APIError`.
 * Throwing these keeps a single error type across server API calls
 * and the express error handler.
 */
export const badRequest = (message = 'Bad request', details?: ZodFieldError[]) =>
	new APIError('BAD_REQUEST', { message, ...(details && { details }) });

export const unauthorized = (message = 'Unauthorized') => new APIError('UNAUTHORIZED', { message });

export const forbidden = (message = 'Forbidden') => new APIError('FORBIDDEN', { message });

export const notFound = (message = 'Not found') => new APIError('NOT_FOUND', { message });

export const conflict = (message = 'Conflict') => new APIError('CONFLICT', { message });

export const validationFailed = (details: ZodFieldError[], message = 'Validation failed') =>
	new APIError('UNPROCESSABLE_ENTITY', { message, details });

export const tooManyRequests = (message = 'Too many requests') =>
	new APIError('TOO_MANY_REQUESTS', { message });

export const internalServerError = (message = 'Internal server error') =>
	new APIError('INTERNAL_SERVER_ERROR', { message });

export const serviceUnavailable = (message = 'Service unavailable') =>
	new APIError('SERVICE_UNAVAILABLE', { message });

export const toUnauthorizedError = (err: unknown): APIError => {
	if (err instanceof TokenExpiredError) {
		return unauthorized('Token has expired');
	}
	if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
		return unauthorized('Invalid or malformed token');
	}
	return err instanceof APIError ? err : unauthorized('Authentication failed');
};

export const toSignError = (_err?: unknown): APIError => internalServerError('Failed to sign token');
