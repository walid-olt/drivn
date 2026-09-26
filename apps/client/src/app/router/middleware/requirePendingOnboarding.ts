import { fetchActiveAgency } from '@/lib/agency';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * Keeps members whose onboarding is already completed out of the onboarding
 * flow. The flow derives its first step from `onboardingStatus`, and
 * `completed` maps to no step at all, so entering it restarts at branding.
 */
const requirePendingOnboarding: MiddlewareFunction = async ({ request }, next) => {
	const agency = await queryClient.fetchQuery({
		queryKey: QUERY_KEYS.agency,
		staleTime: 0,
		queryFn: fetchActiveAgency,
	});

	if (agency.onboardingStatus === 'completed') {
		// the onboarding guard stashes the originally requested path here
		const redirectTo = new URL(request.url).searchParams.get('redirectTo');
		const destination = redirectTo && /^\/(?!\/)/.test(redirectTo) ? redirectTo : '/agency';
		throw redirect(destination);
	}

	next();
};

export default requirePendingOnboarding;
