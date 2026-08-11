import { describe, expect, it } from 'vitest';
import { locationCreateSchema, locationSchema, locationUpdateSchema } from './location.schema';

const validLocation = {
	_id: '507f1f77bcf86cd799439011',
	organizationId: 'org-1',
	name: 'Airport Office',
	address: '1 Airport Blvd',
	country: 'US',
	city: 'Austin',
	postalCode: '78719',
	type: 'airport' as const,
};

describe('locationSchema', () => {
	it('parses a valid location', () => {
		expect(() => locationSchema.parse(validLocation)).not.toThrow();
	});

	it('requires a valid type', () => {
		expect(() => locationSchema.parse({ ...validLocation, type: 'parking_lot' })).toThrow();
	});

	it('rejects a missing name or address', () => {
		expect(() => locationSchema.parse({ ...validLocation, name: '' })).toThrow();
		expect(() => locationSchema.parse({ ...validLocation, address: '' })).toThrow();
	});
});

describe('locationCreateSchema', () => {
	it('strips _id and organizationId from the output', () => {
		const result = locationCreateSchema.parse({
			name: 'Airport Office',
			address: '1 Airport Blvd',
			country: 'US',
			city: 'Austin',
			type: 'airport',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
	});
});

describe('locationUpdateSchema', () => {
	it('accepts a partial update', () => {
		expect(() => locationUpdateSchema.parse({ name: 'Downtown Office' })).not.toThrow();
	});

	it('strips _id and organizationId from the output', () => {
		const result = locationUpdateSchema.parse({
			name: 'Downtown Office',
			organizationId: 'org-1',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
	});
});
