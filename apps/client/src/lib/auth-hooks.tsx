import { useQuery } from '@tanstack/react-query';
import authClient from './auth-client';
import { QUERY_KEYS } from './query-keys';
import apiClient from './api-client';

export function useSession() {
	return useQuery({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});
}

export function useAgency() {
	return useQuery({
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
export function useAgencies() {
	return useQuery({
		queryKey: QUERY_KEYS.agencies,
		queryFn: () => authClient.organization.list(),
	});
}
