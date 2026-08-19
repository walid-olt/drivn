import { useQuery } from '@tanstack/react-query';
import authClient from './auth-client';

export default function useOrganizations() {
	return useQuery({
		queryKey: [],
		queryFn: () => authClient.organization.list(),
	});
}
