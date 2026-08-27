import type { Request, Response, NextFunction } from 'express';
import type { ApiError, ZodFieldError } from '@drivn/shared';

/**
 * better-auth/better-call can throw either its `APIError` subclass or the
 * base `InternalAPIError` (e.g. request validation failures), and the two
 * don't share an importable class at runtime here — detect structurally.
 */
type ApiLikeError = Error & {
	statusCode: number;
	body?: { message?: string; code?: string; details?: ZodFieldError[] } & Record<string, unknown>;
};

const isApiLikeError = (err: unknown): err is ApiLikeError =>
	err instanceof Error &&
	typeof (err as ApiLikeError).statusCode === 'number' &&
	typeof (err as ApiLikeError).body !== 'undefined';

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	if (isApiLikeError(err)) {
		res.status(err.statusCode).json({
			success: false,
			status: err.statusCode,
			message: err.body?.message ?? err.message,
			...(err.body?.code && { code: err.body.code }),
			...(err.body?.details && { details: err.body.details }),
		} satisfies ApiError);
		return;
	}

	console.error('Unhandled error:', err);

	res.status(500).json({
		success: false,
		status: 500,
		message: 'Internal server error',
	} satisfies ApiError);
}
