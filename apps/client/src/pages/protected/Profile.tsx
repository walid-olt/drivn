import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import authClient from '@/lib/auth-client';
import { Link } from 'react-router';

export default function Profile() {
	const { isPending, data } = authClient.useSession();

	if (isPending) return <div>Loading...</div>;

	const { user } = data!;

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
