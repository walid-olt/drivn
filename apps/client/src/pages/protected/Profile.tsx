import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import { useSession } from '@/lib/auth-hooks';
import { Link } from 'react-router';

export default function Profile() {
	const { isPending, isError, data: result, error } = useSession();

	if (isPending) return <div>Loading...</div>;

	if (isError || !result || result.error || !result.data) {
		return <p>{error?.message ?? result?.error?.message}</p>;
	}

	const { user } = result.data;

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">
				Profile | {user.name} | {user.email}{' '}
			</Typography>
			<Typography variant="h2">User Type: {user.type}</Typography>
			<Typography variant="h2">verified : {user.emailVerified ? 'true' : 'false'}</Typography>
			<Link to="/">Go Back</Link>
			<SignOutButton />
		</div>
	);
}
