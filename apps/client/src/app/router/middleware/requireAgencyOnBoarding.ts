import apiClient from '@/lib/api-client';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { getRedirectUrl } from '@/lib/utils';
import type { Agency } from '@drivn/shared';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * redirect agency members to finish onboarding
 */
const requireAgencyOnboarding: MiddlewareFunction = async ({ request }, next) => {
	const agency = await queryClient.ensureQueryData<Agency>({
		queryKey: QUERY_KEYS.agency,
		queryFn: async () => {
			const [err, res] = await apiClient.agency.getActive();
			if (err) throw err;
			if (!res.success) throw new Error(res.message);
			return res.data;
		},
	});
	if (agency.onboardingStatus !== 'completed')
		throw redirect(getRedirectUrl(request, '/agency/onboarding'));
	next();
};

export default requireAgencyOnboarding;
