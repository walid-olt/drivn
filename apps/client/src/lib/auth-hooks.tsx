import { useSuspenseQuery } from '@tanstack/react-query';
import authClient from './auth-client';
import { QUERY_KEYS } from './query-keys';
import apiClient from './api-client';
import type { Agency } from '@drivn/shared';

export function useSession() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});
}

export function useAgency() {
	return useSuspenseQuery<Agency>({
		queryKey: QUERY_KEYS.agency,
		queryFn: async () => {
			const [err, res] = await apiClient.agency.getActive();
			if (err) throw err;
			const { success } = res;
			if (!success) throw new Error(res.message);
			return res.data;
		},
	});
}

export function useMembership() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.membership,
		queryFn: () => authClient.organization.getActiveMember(),
	});
}

export function useAgencies() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.agencies,
		queryFn: () => authClient.organization.list(),
	});
}
