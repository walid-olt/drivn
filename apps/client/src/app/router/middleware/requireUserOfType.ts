import { requireSession } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

export default function requireUserOfType(types: ('customer' | 'agency_member')[]) {
	return async function ({ request }, next) {
		const { user } = await requireSession(request);
		if (!(types as string[]).includes(user.type)) throw redirect('/unauthorized');
		next();
	} as MiddlewareFunction;
}
