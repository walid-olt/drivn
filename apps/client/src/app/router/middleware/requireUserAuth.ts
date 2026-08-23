import { requireSession } from '@/lib/auth-space';
import type { MiddlewareFunction } from 'react-router';

const requireUserAuth: MiddlewareFunction = async ({ request }, next) => {
	await requireSession(request);
	next();
};

export default requireUserAuth;
