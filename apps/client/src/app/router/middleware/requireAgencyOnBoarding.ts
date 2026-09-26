import { fetchActiveAgency } from '@/lib/agency';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { getRedirectUrl } from '@/lib/utils';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * redirect agency members to finish onboarding
 */
const requireAgencyOnboarding: MiddlewareFunction = async ({ request }, next) => {
	/**
	 * `ensureQueryData` resolves with the cached agency whenever an entry
	 * exists, even if it was invalidated in the meantime, so onboarding
	 * would never be observed as completed. `staleTime: 0` makes the
	 * guard re-read the active agency on every navigation.
	 */
	const agency = await queryClient.fetchQuery({
		queryKey: QUERY_KEYS.agency,
		staleTime: 0,
		queryFn: fetchActiveAgency,
	});
	if (agency.onboardingStatus !== 'completed')
		throw redirect(getRedirectUrl(request, '/agency/onboarding'));
	next();
};

export default requireAgencyOnboarding;
