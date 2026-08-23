import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { redirectToLogin } from '@/lib/utils';

export async function requireSession(request: Request) {
	const { data: session, error: sessionError } = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
		staleTime: 1000 * 60 * 5,
	});

	if (!session || sessionError) {
		const isSessionExpired = sessionError?.code === authClient.$ERROR_CODES.SESSION_EXPIRED.code;

		// Ensure bad session data is wiped from cache if it errored
		queryClient.removeQueries({ queryKey: QUERY_KEYS.session });

		redirectToLogin(
			request,
			isSessionExpired ? 'Your session has expired. Please log in again.' : undefined,
		);
	}

	return session;
}

export async function resolvePostAuthPath(): Promise<string> {
	const { data: session, error: sessionError } = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
		staleTime: 1000 * 60 * 5,
	});

	if (!session || sessionError) return '/login';
	if (session.user.type === 'customer') return '/profile';

	const { data: agencies } = await authClient.organization.list();
	return agencies && agencies.length > 0 ? '/agency' : '/no-agency';
}

export async function requireAgency(request: Request) {
	const { data: agencies, error } = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.agencies,
		queryFn: () => authClient.organization.list(),
		staleTime: 1000 * 60 * 5,
	});

	if (error || !agencies) {
		queryClient.removeQueries({ queryKey: QUERY_KEYS.agencies });
		redirectToLogin(request);
	}

	return agencies;
}
