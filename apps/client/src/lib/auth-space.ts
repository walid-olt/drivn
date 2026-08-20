import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { redirectToLogin } from '@/lib/utils';

export async function requireSession(request: Request) {
	const { data: session, error: sessionError } = await queryClient.ensureQueryData({
		queryKey: ['session'],
		queryFn: () => authClient.getSession(),
	});

	if (!session || sessionError) {
		const isSessionExpired = sessionError?.code === authClient.$ERROR_CODES.SESSION_EXPIRED.code;
		redirectToLogin(
			request,
			isSessionExpired ? 'Your session has expired. Please log in again.' : undefined,
		);
	}

	return session;
}

export async function getUserOrganizations(userId: string) {
	const { data: organizations, error } = await queryClient.ensureQueryData({
		queryKey: [userId, 'organizations'],
		queryFn: () => authClient.organization.list(),
	});

	if (error || !organizations) {
		throw new Error('Unable to load user organizations');
	}

	return organizations;
}

export async function resolveCurrentUserSpace() {
	const { data: session, error: sessionError } = await authClient.getSession();

	if (sessionError || !session) {
		throw new Error('Unable to resolve user space without a valid session');
	}

	const role = (session.user as any).role as string;

	return {
		space: role === 'agency' ? 'agency' : 'customer',
		session,
	} as const;
}
