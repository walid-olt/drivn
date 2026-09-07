import z from 'zod';
import {
	agencySchema,
	createAgencySchema,
	updateAgencySchema,
	updateAgencyBranding,
	updateAgencyLocations,
	updateAgencySupport,
} from '../schemas/agency.schema.ts';

export type Agency = z.infer<typeof agencySchema>;
export type CreateAgencyDto = z.infer<typeof createAgencySchema>;
export type UpdateAgencyDto = z.infer<typeof updateAgencySchema>;
export type UpdateAgencyBrandingDto = z.infer<typeof updateAgencyBranding>;
export type UpdateAgencySupportDto = z.infer<typeof updateAgencySupport>;
export type UpdateAgencyLocationsDto = z.infer<typeof updateAgencyLocations>;
