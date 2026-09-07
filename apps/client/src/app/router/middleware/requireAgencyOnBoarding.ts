import apiClient from '@/lib/api-client';
import { getRedirectUrl } from '@/lib/utils';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * redirect agency members to finish onboarding
 */
const requireAgencyOnboarding: MiddlewareFunction = async ({ request }, next) => {
	const [err, res] = await apiClient.agency.getActive();
	if (err) throw err;
	const { success } = res;
	if (!success) throw new Error(res.message);
	const agency = res.data;
	if (agency.onboardingStatus !== 'completed')
		throw redirect(getRedirectUrl(request, '/agency/onboarding'));
	next();
};

export default requireAgencyOnboarding;
