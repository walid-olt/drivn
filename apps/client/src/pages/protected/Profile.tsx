import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import type authClient from '@/lib/auth-client';
import { useLoaderData } from 'react-router';

export default function Profile() {
	const session = useLoaderData() as typeof authClient.$Infer.Session;
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">Profile | {session.user.name}</Typography>
			<SignOutButton />
		</div>
	);
}
