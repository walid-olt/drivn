import { requireAgency } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

const requireAgencyMembership: MiddlewareFunction = async ({ request }, next) => {
	const agencies = await requireAgency(request);
	if (agencies.length === 0) throw redirect('/no-agency');
	next();
};

export default requireAgencyMembership;
