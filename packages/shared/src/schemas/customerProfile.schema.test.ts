import { describe, expect, it } from 'vitest';
import {
	createCustomerProfileSchema,
	updateCustomerProfileSchema,
	customerProfileSchema,
} from './customerProfile.schema';

const validProfile = {
	_id: '507f1f77bcf86cd799439011',
	userId: 'user-1',
	firstName: 'John',
	lastName: 'Doe',
	birthDate: '1990-05-15T00:00:00.000Z',
	phone: '+14155552671',
	country: 'US',
};

describe('customerProfileSchema', () => {
	it('parses a valid profile', () => {
		expect(() => customerProfileSchema.parse(validProfile)).not.toThrow();
	});

	it('rejects a birth date in the future', () => {
		const future = new Date(Date.now() + 86_400_000).toISOString();
		expect(() => customerProfileSchema.parse({ ...validProfile, birthDate: future })).toThrow();
	});

	it('accepts a birth date on today', () => {
		expect(() =>
			customerProfileSchema.parse({ ...validProfile, birthDate: new Date().toISOString() }),
		).not.toThrow();
	});

	it('rejects an invalid phone number', () => {
		expect(() => customerProfileSchema.parse({ ...validProfile, phone: '123' })).toThrow();
	});

	it('rejects short names', () => {
		expect(() => customerProfileSchema.parse({ ...validProfile, firstName: 'A' })).toThrow();
		expect(() => customerProfileSchema.parse({ ...validProfile, lastName: 'B' })).toThrow();
	});

	it('rejects an empty country', () => {
		expect(() => customerProfileSchema.parse({ ...validProfile, country: '' })).toThrow();
	});
});

describe('createCustomerProfileSchema', () => {
	it('strips _id and userId from the output', () => {
		const result = createCustomerProfileSchema.parse({
			firstName: 'John',
			lastName: 'Doe',
			birthDate: '1990-05-15T00:00:00.000Z',
			phone: '+14155552671',
			country: 'US',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('userId');
	});
});

describe('updateCustomerProfileSchema', () => {
	it('accepts a partial update', () => {
		expect(() => updateCustomerProfileSchema.parse({ firstName: 'Jane' })).not.toThrow();
	});
});
