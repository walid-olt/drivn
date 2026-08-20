import { redirect, type LoaderFunction } from 'react-router';
import { requireSession } from '@/lib/auth-space';

const customerSpaceLoader: LoaderFunction = async ({ request }) => {
	const session = await requireSession(request);

	if ((session.user as any).role === 'agency') throw redirect('/agency');

	return session;
};
export default customerSpaceLoader;
