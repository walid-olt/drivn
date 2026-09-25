import {
	tryCatch,
	updateAgencyBranding,
	updateAgencyLocations,
	updateAgencySupport,
} from '@drivn/shared';
import type { Request } from 'express';
import path from 'path';
import { internalServerError, notFound, validationFailed } from '../../errors';
import agencyService, { AgencyService } from './agency.service';
import { toFieldErrors } from '../../lib/utils';
import locationService, { LocationService } from '../location/location.service';
import type { IStorageService } from '../../types/storage';
import { localStorageService } from '../../lib/services/LocalStorageService';

class AgencyController {
	constructor(
		private readonly agencyService: AgencyService,
		private readonly locationService: LocationService,
		private readonly storageService: IStorageService,
	) {}

	// already populated by requireAgency middleware
	getAgency = async (req: Request) => req.agency!;

	setAgencyBranding = async (req: Request) => {
		const files = (req.files ?? {}) as Record<string, Express.Multer.File[]>;
		const uploaded: Record<string, string> = {};
		for (const field of ['logo', 'banner'] as const) {
			const file = files[field]?.[0];
			if (!file) continue;
			const ext = path.extname(file.originalname).toLowerCase();
			const [error, stored] = await tryCatch(
				this.storageService.save({
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
			...(req.body.summary ? { summary: req.body.summary } : {}),
		});
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [error, agency] = await this.agencyService.completeBranding(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	};
	setAgencySupport = async (req: Request) => {
		const parsed = updateAgencySupport.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));
		const [error, agency] = await this.agencyService.completeSupport(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	};

	setAgencyLocations = async (req: Request) => {
		const parsed = updateAgencyLocations.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [fetchError] = await this.locationService.getManyByIds(parsed.data.operatingLocationIds);
		if (fetchError) throw internalServerError('Failed to validate locations');

		const [error, agency] = await agencyService.completeLocations(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		return agency;
	};

	/**
	 * Updates operating locations for an agency whose onboarding is already
	 * completed. Unlike `setAgencyLocations`, it never advances onboarding.
	 */
	updateLocations = async (req: Request) => {
		const parsed = updateAgencyLocations.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [fetchError] = await this.locationService.getManyByIds(parsed.data.operatingLocationIds);
		if (fetchError) throw internalServerError('Failed to validate locations');

		const [error, agency] = await this.agencyService.updateLocations(
			req.agency!._id.toString(),
			parsed.data,
		);
		if (error) throw error;
		if (!agency) throw notFound('Agency not found');
		return agency;
	};
}

export const agencyController = new AgencyController(
	agencyService,
	locationService,
	localStorageService,
);
