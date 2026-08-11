import { describe, expect, it } from 'vitest';
import {
	createUserProfileSchema,
	updateUserProfileSchema,
	userProfileSchema,
} from './userProfile.schema';

const validProfile = {
	_id: '507f1f77bcf86cd799439011',
	userId: 'user-1',
	firstName: 'John',
	lastName: 'Doe',
	birthDate: '1990-05-15T00:00:00.000Z',
	phone: '+14155552671',
	country: 'US',
};

describe('userProfileSchema', () => {
	it('parses a valid profile', () => {
		expect(() => userProfileSchema.parse(validProfile)).not.toThrow();
	});

	it('rejects a birth date in the future', () => {
		const future = new Date(Date.now() + 86_400_000).toISOString();
		expect(() => userProfileSchema.parse({ ...validProfile, birthDate: future })).toThrow();
	});

	it('accepts a birth date on today', () => {
		expect(() =>
			userProfileSchema.parse({ ...validProfile, birthDate: new Date().toISOString() }),
		).not.toThrow();
	});

	it('rejects an invalid phone number', () => {
		expect(() => userProfileSchema.parse({ ...validProfile, phone: '123' })).toThrow();
	});

	it('rejects short names', () => {
		expect(() => userProfileSchema.parse({ ...validProfile, firstName: 'A' })).toThrow();
		expect(() => userProfileSchema.parse({ ...validProfile, lastName: 'B' })).toThrow();
	});

	it('rejects an empty country', () => {
		expect(() => userProfileSchema.parse({ ...validProfile, country: '' })).toThrow();
	});
});

describe('createUserProfileSchema', () => {
	it('strips _id and userId from the output', () => {
		const result = createUserProfileSchema.parse({
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

describe('updateUserProfileSchema', () => {
	it('accepts a partial update', () => {
		expect(() => updateUserProfileSchema.parse({ firstName: 'Jane' })).not.toThrow();
	});
});
