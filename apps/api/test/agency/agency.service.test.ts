import { describe, it, expect } from 'vitest';
import { Types } from 'mongoose';
import Agency from '../../src/modules/agency/agency.model';
import agencyService from '../../src/modules/agency/agency.service';

const statusCodeOf = (error: unknown): number | undefined =>
	typeof error === 'object' && error !== null && 'statusCode' in error
		? (error as { statusCode?: number }).statusCode
		: undefined;

describe('[AGENCY SERVICE · ONBOARDING]', () => {
	describe('getNextOnboardingStatus', () => {
		it('maps every status to the next step', () => {
			expect(agencyService.getNextOnboardingStatus('not_started')).toBe('branding');
			expect(agencyService.getNextOnboardingStatus('branding')).toBe('support');
			expect(agencyService.getNextOnboardingStatus('support')).toBe('locations');
			expect(agencyService.getNextOnboardingStatus('locations')).toBe('completed');
			expect(agencyService.getNextOnboardingStatus('completed')).toBe('completed');
		});
	});

	describe('strict step advancement', () => {
		const createAgency = async () =>
			Agency.create({
				organizationId: new Types.ObjectId().toString(),
				name: 'Acme Rentals',
				slug: 'acme-rentals',
				onboardingStatus: 'not_started',
				operatingLocationIds: [],
			});

		it('advances from not_started to branding', async () => {
			const agency = await createAgency();

			const [error, result] = await agencyService.completeBranding(String(agency._id), {
				summary: 'Premium car rentals',
			});
			expect(error).toBeUndefined();
			expect(result!.onboardingStatus).toBe('branding');
			expect(result!.summary).toBe('Premium car rentals');
		});

		it('rejects completing a step out of order', async () => {
			const agency = await createAgency();

			const [error] = await agencyService.completeSupport(String(agency._id), {
				supportEmail: 'support@acme.com',
			});
			expect(statusCodeOf(error)).toBe(409);
		});

		it('goes through support → locations → completed', async () => {
			const agency = await createAgency();
			await agencyService.completeBranding(String(agency._id), { summary: 'Summary' });
			await agencyService.completeSupport(String(agency._id), {
				supportEmail: 'support@acme.com',
			});

			const [error, result] = await agencyService.completeLocations(String(agency._id), {
				operatingLocationIds: ['507f1f77bcf86cd799439011'],
			});
			expect(error).toBeUndefined();
			expect(result!.onboardingStatus).toBe('completed');
			expect(result!.operatingLocationIds.map(String)).toEqual(['507f1f77bcf86cd799439011']);
		});

		it('rejects re-running the locations step once completed', async () => {
			const agency = await createAgency();
			await agencyService.completeBranding(String(agency._id), { summary: 'Summary' });
			await agencyService.completeSupport(String(agency._id), {
				supportEmail: 'support@acme.com',
			});
			await agencyService.completeLocations(String(agency._id), {
				operatingLocationIds: ['507f1f77bcf86cd799439011'],
			});

			const [error] = await agencyService.completeLocations(String(agency._id), {
				operatingLocationIds: ['507f1f77bcf86cd799439011'],
			});
			expect(statusCodeOf(error)).toBe(409);
		});
	});
});
