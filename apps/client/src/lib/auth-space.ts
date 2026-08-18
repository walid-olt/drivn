import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { redirectToLogin } from '@/lib/utils';

type SessionResult = Awaited<ReturnType<typeof authClient.getSession>>;
type SessionData = NonNullable<SessionResult['data']>;
type OrganizationsResult = Awaited<ReturnType<typeof authClient.organization.list>>;

function getOrganizationsQueryKey(userId: string) {
	return [userId, 'organizations'] as const;
}

export async function requireSession(request: Request): Promise<SessionData> {
	const { data: session, error: sessionError } = await queryClient.ensureQueryData({
		queryKey: ['session'],
		queryFn: () => authClient.getSession(),
	});

	if (!session || sessionError) {
		const isSessionExpired =
			sessionError?.code === authClient.$ERROR_CODES.SESSION_EXPIRED.code;
		redirectToLogin(
			request,
			isSessionExpired ? 'Your session has expired. Please log in again.' : undefined,
		);
	}

	return session;
}

export async function getUserOrganizations(userId: string): Promise<NonNullable<OrganizationsResult['data']>> {
	const { data: organizations, error } = await queryClient.ensureQueryData({
		queryKey: getOrganizationsQueryKey(userId),
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

	const organizations = await getUserOrganizations(session.user.id);

	return {
		space: organizations.length > 0 ? 'agency' : 'customer',
		organizations,
		session,
	} as const;
}
