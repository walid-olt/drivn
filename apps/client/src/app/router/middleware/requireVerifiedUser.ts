import { requireSession } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

const requireVerifiedUser: MiddlewareFunction = async ({ request }, next) => {
	const session = await requireSession(request);
	const user = session.user;
	const isVerified = user.emailVerified;

	if (!isVerified)
		throw redirect('/verify-email/request?message=Please verify your email to access this page.');
	next();
};

export default requireVerifiedUser;
