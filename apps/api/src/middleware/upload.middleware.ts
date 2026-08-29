import type { RequestHandler } from 'express';
import multer from 'multer';
import { ACCEPTED_IMAGE_TYPES, MAX_AGENCY_BANNER_SIZE_MB } from '@drivn/shared';
import { badRequest } from '../errors';

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: MAX_AGENCY_BANNER_SIZE_MB * 1024 * 1024,
		files: 2,
	},
	fileFilter: (_req, file, cb) => {
		if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
			cb(badRequest('Only image files (jpeg, png, webp) are allowed'));
			return;
		}
		cb(null, true);
	},
});

const uploadBrandingFields = upload.fields([
	{ name: 'logo', maxCount: 1 },
	{ name: 'banner', maxCount: 1 },
]);

const multerMessage = (err: multer.MulterError): string => {
	switch (err.code) {
		case 'LIMIT_FILE_SIZE':
			return `File is too large (max ${MAX_AGENCY_BANNER_SIZE_MB}MB)`;
		case 'LIMIT_FILE_COUNT':
			return 'Too many files uploaded';
		case 'LIMIT_UNEXPECTED_FILE':
			return 'Unexpected file field';
		default:
			return err.message;
	}
};

/**
 * Handles the `logo` and `banner` image fields (multipart/form-data) for the
 * branding onboarding step. Errors (wrong type, too large, missing parts) are
 * normalized to `400` responses through the API error handler.
 */
export const uploadBrandingFiles: RequestHandler = (req, res, next) => {
	uploadBrandingFields(req, res, (err: unknown) => {
		if (err) {
			if (err instanceof multer.MulterError) {
				next(badRequest(multerMessage(err)));
				return;
			}
			next(err);
			return;
		}
		next();
	});
};
