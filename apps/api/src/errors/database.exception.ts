import { mongo, Error as MongooseError } from 'mongoose';
import type { ZodFieldError } from '@drivn/shared';
import { APIError } from 'better-auth';
import {
	badRequest,
	conflict,
	internalServerError,
	notFound,
	serviceUnavailable,
	validationFailed,
} from './http.exception.ts';

type MongoDuplicateKeyError = mongo.MongoServerError & { code: 11000 };

export const isMongooseValidationError = (err: unknown): err is MongooseError.ValidationError =>
	err instanceof MongooseError.ValidationError;

export const isMongooseCastError = (err: unknown): err is MongooseError.CastError =>
	err instanceof MongooseError.CastError;

export const isMongooseDocumentNotFoundError = (
	err: unknown,
): err is MongooseError.DocumentNotFoundError => err instanceof MongooseError.DocumentNotFoundError;

export const isMongooseVersionError = (err: unknown): err is MongooseError.VersionError =>
	err instanceof MongooseError.VersionError;

export const isMongoServerError = (err: unknown): err is mongo.MongoServerError =>
	err instanceof mongo.MongoServerError;

export const isMongoDuplicateKeyError = (err: unknown): err is MongoDuplicateKeyError =>
	isMongoServerError(err) && err.code === 11000;

export const isMongoNetworkError = (err: unknown): err is mongo.MongoNetworkError =>
	err instanceof mongo.MongoNetworkError || err instanceof mongo.MongoServerSelectionError;

export const isDatabaseError = (err: unknown): boolean =>
	isMongooseValidationError(err) ||
	isMongooseCastError(err) ||
	isMongooseDocumentNotFoundError(err) ||
	isMongooseVersionError(err) ||
	isMongoServerError(err) ||
	isMongoNetworkError(err);

const mongooseValidationDetails = (err: MongooseError.ValidationError): ZodFieldError[] =>
	Object.values(err.errors).map((fieldError) => ({
		field: fieldError.path,
		message: fieldError.message,
		code: fieldError.kind,
	}));

const duplicateField = (err: MongoDuplicateKeyError): string | undefined => {
	const keyPattern = err.keyPattern ?? {};
	return Object.keys(keyPattern)[0];
};

/**
 * Converts known Mongoose/MongoDB failures to the API's public error type.
 * Unknown errors become a generic server error so database internals are not
 * returned to clients.
 */
export const toDatabaseApiError = (err: unknown): APIError => {
	if (err instanceof APIError) return err;

	if (isMongooseValidationError(err)) {
		return validationFailed(mongooseValidationDetails(err));
	}

	if (isMongooseCastError(err)) {
		return badRequest(`Invalid value for ${err.path}`);
	}

	if (isMongooseDocumentNotFoundError(err)) {
		return notFound('The requested document was not found');
	}

	if (isMongooseVersionError(err)) {
		return conflict('The document was modified by another request');
	}

	if (isMongoDuplicateKeyError(err)) {
		const field = duplicateField(err);
		return conflict(
			field ? `A record with this ${field} already exists` : 'A record already exists',
		);
	}

	if (isMongoNetworkError(err)) {
		return serviceUnavailable('Database service is unavailable');
	}

	if (isMongoServerError(err)) {
		return internalServerError('Database operation failed');
	}

	return internalServerError();
};
