import { redirect, type LoaderFunction } from 'react-router';
import { getUserOrganizations, requireSession } from '@/lib/auth-space';

const organizationAuthLoader: LoaderFunction = async ({ request }) => {
	const session = await requireSession(request);
	const organizations = await getUserOrganizations(session.user.id);

	if (organizations.length === 0) throw redirect('/no-agency');

	return organizations;
};

export default organizationAuthLoader;
