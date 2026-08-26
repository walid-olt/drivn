import { useQuery } from '@tanstack/react-query';
import authClient from './auth-client';
import { QUERY_KEYS } from './query-keys';

export function useSession() {
	return useQuery({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});
}

export function useAgencies() {
	return useQuery({
		queryKey: QUERY_KEYS.agencies,
		queryFn: () => authClient.organization.list(),
	});
}
