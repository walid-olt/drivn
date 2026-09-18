import multer from 'multer';
import { ACCEPTED_IMAGE_TYPES, MAX_CAR_IMAGE_SIZE_BYTES, MAX_CAR_IMAGES } from '@drivn/shared';
import { badRequest } from '../../errors';
import type { RequestHandler } from 'express';
import { toMulterMessage } from '../../lib/utils';

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (_req, file, cb) => {
		if (![...(ACCEPTED_IMAGE_TYPES as any as string[])].includes(file.mimetype)) {
			cb(badRequest('Only image files (jpeg, png, webp) are allowed'));
			return;
		}
		cb(null, true);
	},
	limits: {
		fileSize: MAX_CAR_IMAGE_SIZE_BYTES,
		files: MAX_CAR_IMAGES,
	},
});

const uploadCarImages = upload.array('images', MAX_CAR_IMAGES);

export const handleUploadCarImages: RequestHandler = (req, res, next) => {
	uploadCarImages(req, res, (error: unknown) => {
		if (error instanceof multer.MulterError) {
			next(badRequest(toMulterMessage(error)));
			return;
		}
		if (error) {
			next(error);
			return;
		}
		next();
	});
};
