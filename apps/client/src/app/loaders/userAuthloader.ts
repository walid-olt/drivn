import queryClient from '@/lib/query-client';
import authClient from '@/lib/auth-client';
import { type LoaderFunction } from 'react-router';
import { redirectToLogin } from '@/lib/utils';

const userAuthLoader: LoaderFunction = async ({ request }) => {
	// get the session from cached query data or fetch it if not available
	const { data: session, error } = await queryClient.ensureQueryData({
		queryKey: ['session'],
		queryFn: () => authClient.getSession(),
	});

	if (!session || error) {
		const erroCode = error?.code;
		const hasExpiredSession =
			erroCode !== undefined && erroCode === authClient.$ERROR_CODES.SESSION_EXPIRED.code;

		redirectToLogin(
			request,
			!hasExpiredSession ? 'Your session has expired! try loggin in again.' : undefined,
		);
	}

	return session;
};
export default userAuthLoader;
