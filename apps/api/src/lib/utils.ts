import type { ZodFieldError } from '@drivn/shared';
import type { MulterError } from 'multer';
import type z from 'zod';

export const toFieldErrors = (error: z.ZodError): ZodFieldError[] =>
	error.issues.map((issue) => ({
		field: issue.path.join('.') || 'root',
		message: issue.message,
		code: issue.code,
	}));

export const toMulterMessage = (err: MulterError): string => {
	switch (err.code) {
		case 'LIMIT_FILE_SIZE':
			return `File is too large`;
		case 'LIMIT_FILE_COUNT':
			return 'Too many files uploaded';
		case 'LIMIT_UNEXPECTED_FILE':
			return 'Unexpected file field';
		default:
			return err.message;
	}
};
