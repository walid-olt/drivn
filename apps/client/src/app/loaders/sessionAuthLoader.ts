import { requireSession } from '@/lib/auth-space';
import { type LoaderFunction } from 'react-router';

const sessionAuthLoader: LoaderFunction = async ({ request }) => {
	return requireSession(request);
};

export default sessionAuthLoader;
