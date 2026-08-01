import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '../errors/http.exception.js';
import { ApiStatusCode, ApiErrorCode } from '@drivn/shared';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
	if (err instanceof HttpException) {
		res.status(err.status).json(err.toResponse());
		return;
	}

	console.error('Unhandled error:', err);

	res.status(ApiStatusCode.INTERNAL_SERVER_ERROR).json({
		success: false,
		status: ApiStatusCode.INTERNAL_SERVER_ERROR,
		code: ApiErrorCode.INTERNAL_ERROR,
		message: 'Internal server error',
	});
}
