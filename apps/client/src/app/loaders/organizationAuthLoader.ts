import { redirect, type LoaderFunction } from 'react-router';
import { getUserOrganizations, requireSession } from '@/lib/auth-space';

const organizationAuthLoader: LoaderFunction = async ({ request }) => {
	const session = await requireSession(request);

	if ((session.user as any).role !== 'agency') throw redirect('/no-agency');

	const organizations = await getUserOrganizations(session.user.id);

	return organizations;
};

export default organizationAuthLoader;
