import { Router } from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { z } from 'zod';
import {
	updateAgencyBranding,
	updateAgencyLocations,
	updateAgencySupport,
	type ZodFieldError,
} from '@drivn/shared';
import { badRequest, internalServerError, validationFailed } from '../../errors';
import { handler } from '../../lib/handler';
import { tryCatch } from '@drivn/shared';
import { localStorageService } from '../../lib/services/LocalStorageService';
import { authenticate, requireAgency } from '../../middleware';
import { uploadBrandingFiles } from '../../middleware/upload.middleware';
import agencyService from './agency.service';
import locationService from '../location/location.service';

const router = Router();
router.use(authenticate, requireAgency);

const toFieldErrors = (error: z.ZodError): ZodFieldError[] =>
	error.issues.map((issue) => ({
		field: issue.path.join('.') || 'root',
		message: issue.message,
		code: issue.code,
	}));

router.get(
	'/',
	handler(async (req) => req.agency),
);

router.put(
	'/onboarding/branding',
	uploadBrandingFiles,
	handler(async (req) => {
		const files = (req.files ?? {}) as Record<string, Express.Multer.File[]>;
		const uploaded: Record<string, string> = {};
		for (const field of ['logo', 'banner'] as const) {
			const file = files[field]?.[0];
			if (!file) continue;
			const ext = path.extname(file.originalname).toLowerCase();
			const [error, stored] = await tryCatch(
				localStorageService.save({
					filename: `${field}-${crypto.randomUUID()}${ext}`,
					mimeType: file.mimetype,
					content: file.buffer,
				}),
			);
			if (error) throw internalServerError('Failed to store uploaded branding file');
			uploaded[field] = stored.url;
		}

		const parsed = updateAgencyBranding.safeParse({
			...(uploaded.logo && { logo: uploaded.logo }),
			...(uploaded.banner && { banner: uploaded.banner }),
			...(req.body.summary ? { summary: String(req.body.summary) } : {}),
		});
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [error, agency] = await agencyService.completeBranding(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	}),
);

router.put(
	'/onboarding/support',
	handler(async (req) => {
		const parsed = updateAgencySupport.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));
		const [error, agency] = await agencyService.completeSupport(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	}),
);

router.put(
	'/onboarding/locations',
	handler(async (req) => {
		const parsed = updateAgencyLocations.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [fetchError, existing] = await locationService.getManyByIds(
			parsed.data.operatingLocationIds,
		);
		if (fetchError) throw internalServerError('Failed to validate locations');
		if (existing!.length !== parsed.data.operatingLocationIds.length) {
			const existingIds = new Set(existing!.map((l) => l._id.toString()));
			const invalidIds = parsed.data.operatingLocationIds.filter((id) => !existingIds.has(id));
			throw badRequest(`Invalid location IDs: ${invalidIds.join(', ')}`);
		}

		const [error, agency] = await agencyService.completeLocations(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	}),
);

export default router;
