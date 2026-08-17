import { Typography } from '@/components/ui/typography';
import type authClient from '@/lib/auth-client';
import { useLoaderData } from 'react-router';

export default function Profile() {
	const session = useLoaderData() as typeof authClient.$Infer.Session;
	return (
		<div className={'flex h-screen w-screen items-center justify-center'}>
			<Typography variant="h1">Profile | {session.user.name}</Typography>
		</div>
	);
}
