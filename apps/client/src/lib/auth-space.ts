import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { redirectToLogin } from '@/lib/utils';

export async function requireSession(request: Request) {
	const result = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error || !data) return null;
			return data;
		},
	});

	if (!result) {
		queryClient.removeQueries({ queryKey: QUERY_KEYS.session });
		redirectToLogin(request);
	}
	return result;
}

export async function resolvePostAuthPath() {
	const session = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error || !data) return null;
			return data;
		},
	});

	if (!session) return '/login';
	const agencies = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.agencies,
		queryFn: async () => {
			const { data, error } = await authClient.organization.list();
			if (error) return null;
			return data;
		},
	});
	if (!agencies) return '/login';
	return agencies.length > 0 ? '/agency' : '/no-agency';
}

export async function requireAgency(request: Request) {
	const agencies = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.agencies,
		queryFn: async () => {
			const { data, error } = await authClient.organization.list();
			if (error) return null;
			return data;
		},
	});

	if (!agencies) {
		queryClient.removeQueries({ queryKey: QUERY_KEYS.agencies });
		redirectToLogin(request);
	}

	return agencies;
}
