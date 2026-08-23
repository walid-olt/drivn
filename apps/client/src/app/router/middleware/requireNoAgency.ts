import { requireAgency } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * Ensures the signed-in agency member does not belong to any agency yet,
 * otherwise they are redirected to their agency home.
 */
const requireNoAgency: MiddlewareFunction = async ({ request }, next) => {
	const agencies = await requireAgency(request);
	if (agencies.length > 0) throw redirect('/agency');
	next();
};

export default requireNoAgency;
