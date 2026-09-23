import { useSuspenseQuery } from '@tanstack/react-query';
import authClient from './auth-client';
import { QUERY_KEYS } from './query-keys';
import apiClient from './api-client';
import type { Agency } from '@drivn/shared';

export function useSession() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.session,
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error || !data) throw new Error(error?.message || 'Failed to get session');
			return data;
		},
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
		queryFn: async () => {
			const { data, error } = await authClient.organization.getActiveMember();
			if (error) throw new Error(error.message || 'Failed to get membership');
			return data;
		},
	});
}

export function useAgencies() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.agencies,
		queryFn: async () => {
			const { data, error } = await authClient.organization.list();
			if (error) throw new Error(error.message || 'Failed to list agencies');
			return data;
		},
	});
}
