import { describe, expect, it } from 'vitest';
import { agencySchema, createAgencySchema, updateAgencySchema } from './agency.schema';

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
		expect(result).not.toHaveProperty('organizationId');
	});
});

describe('updateAgencySchema', () => {
	it('accepts a partial update', () => {
		expect(() => updateAgencySchema.parse({ summary: 'New summary' })).not.toThrow();
	});
});

describe('agency slug', () => {
	it('accepts lowercase alphanumerics and hyphens', () => {
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: 'acme-rentals-2' })).not.toThrow();
	});

	it('rejects uppercase letters', () => {
		expect(() => createAgencySchema.parse({ name: 'Acme', slug: 'Acme-rentals' })).toThrow();
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
