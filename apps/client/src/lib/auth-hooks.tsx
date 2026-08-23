import { useQuery } from '@tanstack/react-query';
import authClient from './auth-client';
import { queryKeys } from './query-keys';

export default function useOrganizations() {
	return useQuery({
		queryKey: queryKeys.agencies,
		queryFn: () => authClient.organization.list(),
	});
}
