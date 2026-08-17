import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { organization } from 'better-auth/plugins';
import { redirect, type LoaderFunction } from 'react-router';
const organizationAuthLoader: LoaderFunction = async () => {
	// guarantied to have session since the `userAuthLoader` has already ran
	// and redirected any unauthenticated users.
	const { data: session } = await authClient.getSession();
	const userId = session!.user.id;
	const { data: organizations, error } = await queryClient.ensureQueryData({
		queryKey: [userId, 'organizations'],
		queryFn: () => authClient.organization.list(),
	});
	if (error || !organizations) {
		throw redirect('/login');
	}
	if (organization.length === 0) throw redirect('/no-agency');
	return organizations;
};

export default organizationAuthLoader;
