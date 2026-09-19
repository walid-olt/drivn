import { requireSession } from '@/lib/auth-space';
import { getRedirectUrl } from '@/lib/utils';
import { redirect, type MiddlewareFunction } from 'react-router';

const requireVerifiedUser: MiddlewareFunction = async ({ request }, next) => {
	const session = await requireSession(request);
	const user = session.user;
	const isVerified = user.emailVerified;
	const redirectUrl = getRedirectUrl(request, '/verify-email/request');

	if (!isVerified) throw redirect(redirectUrl);
	next();
};

export default requireVerifiedUser;
