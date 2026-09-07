import type { RequestHandler } from 'express';
import { forbidden, notFound } from '../errors';
import agencyService from '../modules/agency/agency.service';

/**
 * Resolves the active organization of the authenticated session to the
 * associated agency and attaches it to the request. Rejects requests without
 * an active organization or without a matching agency.
 */
export const requireAgency: RequestHandler = async (req, _res, next) => {
	try {
		const organizationId = req.session?.activeOrganizationId;
		if (!organizationId) throw forbidden('No active organization selected');

		const [err, agency] = await agencyService.getByOrganizationId(organizationId);
		if (err) throw err;
		if (!agency) throw notFound('Agency not found');
		req.agency = agency;
		next();
	} catch (err) {
		next(err);
	}
};
