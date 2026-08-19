import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { redirectToLogin } from '@/lib/utils';

function getOrganizationsQueryKey(userId: string) {
	return [userId, 'organizations'] as const;
}

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
		queryKey: getOrganizationsQueryKey(userId),
		queryFn: () => authClient.organization.list(),
	});

	if (error || !organizations) {
		throw new Error('Unable to load user organizations');
	}

	return organizations;
}

// HACK: until I find a better way to resolve the current user space,
// this function will determine if the user is an agency or a customer
// based on their organizations.

export async function resolveCurrentUserSpace() {
	const { data: session, error: sessionError } = await authClient.getSession();

	if (sessionError || !session) {
		throw new Error('Unable to resolve user space without a valid session');
	}

	const organizations = await getUserOrganizations(session.user.id);

	return {
		space: organizations.length > 0 ? 'agency' : 'customer',
		organizations,
		session,
	} as const;
}
