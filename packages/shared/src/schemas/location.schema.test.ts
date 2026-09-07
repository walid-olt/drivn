import { describe, expect, it } from 'vitest';
import {
	locationCreateSchema,
	locationSchema,
	locationUpdateSchema,
	locationQuerySchema,
} from './location.schema';

const validLocation = {
	_id: '507f1f77bcf86cd799439011',
	name: 'Airport Office',
	address: '1 Airport Blvd',
	country: 'Morocco',
	city: 'Casablanca',
	postalCode: '20000',
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

	it('does not require organizationId', () => {
		const result = locationSchema.parse(validLocation);
		expect(result).not.toHaveProperty('organizationId');
	});
});

describe('locationCreateSchema', () => {
	it('strips _id from the output', () => {
		const result = locationCreateSchema.parse({
			name: 'Airport Office',
			address: '1 Airport Blvd',
			country: 'Morocco',
			city: 'Casablanca',
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

	it('strips _id from the output', () => {
		const result = locationUpdateSchema.parse({ name: 'Downtown Office' });
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
	});
});

describe('locationQuerySchema', () => {
	it('applies defaults for page and limit', () => {
		const result = locationQuerySchema.parse({});
		expect(result.page).toBe(1);
		expect(result.limit).toBe(20);
	});

	it('accepts valid filter params', () => {
		const result = locationQuerySchema.parse({
			q: 'airport',
			country: 'Morocco',
			city: 'Casablanca',
			type: 'airport',
			page: 2,
			limit: 10,
		});
		expect(result.q).toBe('airport');
		expect(result.type).toBe('airport');
	});

	it('rejects limit > 100', () => {
		expect(() => locationQuerySchema.parse({ limit: 101 })).toThrow();
	});

	it('rejects invalid type', () => {
		expect(() => locationQuerySchema.parse({ type: 'helipad' })).toThrow();
	});
});
