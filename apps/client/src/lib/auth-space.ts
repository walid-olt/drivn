import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { redirectToLogin } from '@/lib/utils';
type AuthResult<T> =
	| { data: T; error: null }
	| { data: null; error: { code?: string; message?: string } }
	| undefined;
function isOk<T>(result: AuthResult<T>): result is { data: T; error: null } {
	return !!result && !result.error && !!result.data;
}
export async function requireSession(request: Request) {
	const result: AuthResult<typeof authClient.$Infer.Session> = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});

	if (!isOk(result)) {
		const isSessionExpired = result?.error?.code === authClient.$ERROR_CODES.SESSION_EXPIRED.code;
		queryClient.removeQueries({ queryKey: QUERY_KEYS.session });
		redirectToLogin(
			request,
			isSessionExpired ? 'Your session has expired. Please log in again.' : undefined,
		);
	}
	return result.data;
}

export async function resolvePostAuthPath() {
	const sessionResult: AuthResult<any> = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});

	if (!isOk(sessionResult)) return '/login';
	if (sessionResult.data.user.type === 'customer') return '/profile';
	const orgResult: AuthResult<(typeof authClient.$Infer.Organization)[]> =
		await queryClient.ensureQueryData({
			queryKey: QUERY_KEYS.agencies,
			queryFn: () => authClient.organization.list(),
		});
	if (!isOk(orgResult)) return '/login';
	return orgResult.data.length > 0 ? '/agency' : '/no-agency';
}

export async function requireAgency(request: Request) {
	const result: AuthResult<(typeof authClient.$Infer.Organization)[]> =
		await queryClient.ensureQueryData({
			queryKey: QUERY_KEYS.agencies,
			queryFn: () => authClient.organization.list(),
		});

	if (!isOk(result)) {
		queryClient.removeQueries({ queryKey: QUERY_KEYS.agencies });
		redirectToLogin(request);
	}

	return result!.data!;
}
