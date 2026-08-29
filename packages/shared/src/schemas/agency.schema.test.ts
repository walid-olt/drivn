import { describe, expect, it } from 'vitest';
import {
	agencyOnboardingStatusSchema,
	agencySchema,
	createAgencySchema,
	updateAgencyBranding,
	updateAgencyLocations,
	updateAgencySchema,
	updateAgencySupport,
} from './agency.schema';
import { AGENCY_ONBOARDING_STATUS } from '../constants/status';

const validAgency = {
	_id: '507f1f77bcf86cd799439011',
	organizationId: 'org-1',
	name: 'Acme Rentals',
	slug: 'acme-rentals',
};

describe('agencySchema', () => {
	it('parses a valid agency', () => {
		expect(() => agencySchema.parse(validAgency)).not.toThrow();
	});

	it('requires a name of at least 3 characters', () => {
		expect(() => agencySchema.parse({ ...validAgency, name: 'Ac' })).toThrow();
	});

	it('requires a valid support email when provided', () => {
		expect(() => agencySchema.parse({ ...validAgency, supportEmail: 'not-an-email' })).toThrow();
		expect(() =>
			agencySchema.parse({ ...validAgency, supportEmail: 'support@acme.com' }),
		).not.toThrow();
	});

	it('requires a valid support phone when provided', () => {
		expect(() => agencySchema.parse({ ...validAgency, supportPhone: '123' })).toThrow();
		expect(() =>
			agencySchema.parse({ ...validAgency, supportPhone: '+14155552671' }),
		).not.toThrow();
	});

	it('defaults operatingLocationIds to an empty array', () => {
		const result = agencySchema.parse(validAgency);
		expect(result.operatingLocationIds).toEqual([]);
	});

	it('defaults onboardingStatus to not_started', () => {
		const result = agencySchema.parse(validAgency);
		expect(result.onboardingStatus).toBe('not_started');
	});
});

describe('createAgencySchema', () => {
	it('strips _id and organizationId from the output', () => {
		const result = createAgencySchema.parse({
			name: 'Acme Rentals',
			slug: 'acme-rentals',
			organizationId: 'org-1',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).toHaveProperty('organizationId');
	});
});

describe('updateAgencySchema', () => {
	it('accepts a partial update', () => {
		expect(() => updateAgencySchema.parse({ summary: 'New summary' })).not.toThrow();
	});
});

describe('agencyOnboardingStatusSchema', () => {
	it('matches the AGENCY_ONBOARDING_STATUS constant order', () => {
		expect(agencyOnboardingStatusSchema.options).toEqual(AGENCY_ONBOARDING_STATUS);
	});

	it('accepts every onboarding status', () => {
		for (const status of AGENCY_ONBOARDING_STATUS) {
			expect(() => agencyOnboardingStatusSchema.parse(status)).not.toThrow();
		}
	});

	it('rejects unknown statuses', () => {
		expect(() => agencyOnboardingStatusSchema.parse('initial')).toThrow();
	});
});

describe('updateAgencyBranding', () => {
	it('accepts logo, banner and summary', () => {
		const result = updateAgencyBranding.parse({
			logo: 'https://cdn.example.com/logo.png',
			banner: 'https://cdn.example.com/banner.webp',
			summary: 'Premium car rentals',
		});
		expect(result).toMatchObject({ summary: 'Premium car rentals' });
	});

	it('accepts a partial branding update', () => {
		expect(() => updateAgencyBranding.parse({ summary: 'Only a summary' })).not.toThrow();
	});

	it('rejects a non-url logo', () => {
		expect(() => updateAgencyBranding.parse({ logo: 'not-a-url' })).toThrow();
	});

	it('rejects a summary longer than 500 characters', () => {
		expect(() => updateAgencyBranding.parse({ summary: 'a'.repeat(501) })).toThrow();
	});
});

describe('updateAgencySupport', () => {
	it('accepts support email, phone and address', () => {
		const result = updateAgencySupport.parse({
			supportEmail: 'support@acme.com',
			supportPhone: '+14155552671',
			address: {
				city: 'Casablanca',
				country: 'MA',
				addressLine1: '5 Boulevard de la Corniche',
				zipCode: '20000',
			},
		});
		expect(result.address).toMatchObject({ city: 'Casablanca' });
	});

	it('rejects an invalid support email', () => {
		expect(() => updateAgencySupport.parse({ supportEmail: 'not-an-email' })).toThrow();
	});

	it('rejects an invalid support phone', () => {
		expect(() => updateAgencySupport.parse({ supportPhone: '123' })).toThrow();
	});
});

describe('updateAgencyLocations', () => {
	it('accepts at least one operating location', () => {
		expect(() =>
			updateAgencyLocations.parse({ operatingLocationIds: ['507f1f77bcf86cd799439011'] }),
		).not.toThrow();
	});

	it('rejects an empty operatingLocationIds array', () => {
		expect(() => updateAgencyLocations.parse({ operatingLocationIds: [] })).toThrow();
	});

	it('rejects when operatingLocationIds is missing', () => {
		expect(() => updateAgencyLocations.parse({})).toThrow();
	});
});

describe('agency slug', () => {
	it('accepts lowercase alphanumerics and hyphens', () => {
		expect(() =>
			createAgencySchema.parse({
				name: 'Acme',
				slug: 'acme-rentals-2',
				organizationId: 'iouyer987',
			}),
		).not.toThrow();
	});

	it('rejects uppercase letters', () => {
		expect(() =>
			createAgencySchema.parse({
				name: 'Acme',
				slug: 'Acme-rentals',
				organizationId: 'org-1',
			}),
		).toThrow();
	});

	it('rejects spaces and underscores', () => {
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: 'acme rentals' })).toThrow();
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: 'acme_rentals' })).toThrow();
	});

	it('rejects leading or trailing hyphens', () => {
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: '-acme' })).toThrow();
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: 'acme-' })).toThrow();
	});
});
