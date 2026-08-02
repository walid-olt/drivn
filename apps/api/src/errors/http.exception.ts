import { ApiErrorCode, ApiStatusCode, type ZodFieldError, type ApiError } from '@drivn/shared';

export class HttpException extends Error {
	readonly status: ApiStatusCode;
	readonly code: ApiErrorCode;
	readonly details?: ZodFieldError[];

	constructor(
		message: string,
		options: {
			status: ApiStatusCode;
			code: ApiErrorCode;
			details?: ZodFieldError[];
		},
	) {
		super(message);
		this.name = 'HttpException';
		this.status = options.status;
		this.code = options.code;
		this.details = options.details;
	}

	toResponse(): ApiError {
		return {
			success: false,
			status: this.status,
			code: this.code,
			message: this.message,
			...(this.details && { details: this.details }),
		};
	}
}

export class BadRequestException extends HttpException {
	constructor(message = 'Bad request', details?: ZodFieldError[]) {
		super(message, {
			status: ApiStatusCode.BAD_REQUEST,
			code: ApiErrorCode.VALIDATION_ERROR,
			details,
		});
		this.name = 'BadRequestException';
	}
}

export class UnauthorizedException extends HttpException {
	constructor(message = 'Unauthorized', code: ApiErrorCode = ApiErrorCode.AUTH_EXPIRATION) {
		super(message, {
			status: ApiStatusCode.UNAUTHORIZED,
			code,
		});
		this.name = 'UnauthorizedException';
	}
}

export class ForbiddenException extends HttpException {
	constructor(message = 'Forbidden') {
		super(message, {
			status: ApiStatusCode.FORBIDDEN,
			code: ApiErrorCode.AUTH_FORBIDDEN,
		});
		this.name = 'ForbiddenException';
	}
}

export class NotFoundException extends HttpException {
	constructor(message = 'Not found') {
		super(message, {
			status: ApiStatusCode.NOT_FOUND,
			code: ApiErrorCode.NOT_FOUND,
		});
		this.name = 'NotFoundException';
	}
}

export class ConflictException extends HttpException {
	constructor(message = 'Conflict') {
		super(message, {
			status: ApiStatusCode.CONFLICT,
			code: ApiErrorCode.CONFLICT,
		});
		this.name = 'ConflictException';
	}
}

export class ValidationException extends HttpException {
	constructor(details: ZodFieldError[], message = 'Validation failed') {
		super(message, {
			status: ApiStatusCode.UNPROCESSABLE_ENTITY,
			code: ApiErrorCode.VALIDATION_ERROR,
			details,
		});
		this.name = 'ValidationException';
	}
}

export class TooManyRequestsException extends HttpException {
	constructor(message = 'Too many requests') {
		super(message, {
			status: ApiStatusCode.TOO_MANY_REQUESTS,
			code: ApiErrorCode.RATE_LIMIT_EXCEEDED,
		});
		this.name = 'TooManyRequestsException';
	}
}

export class InternalServerErrorException extends HttpException {
	constructor(message = 'Internal server error') {
		super(message, {
			status: ApiStatusCode.INTERNAL_SERVER_ERROR,
			code: ApiErrorCode.INTERNAL_ERROR,
		});
		this.name = 'InternalServerErrorException';
	}
}

export class ServiceUnavailableException extends HttpException {
	constructor(message = 'Service unavailable') {
		super(message, {
			status: ApiStatusCode.SERVICE_UNAVAILABLE,
			code: ApiErrorCode.SERVICE_UNAVAILABLE,
		});
		this.name = 'ServiceUnavailableException';
	}
}
