import { Typography } from '@ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import authClient from '@/lib/auth-client';

const Agency = () => {
	const { isPending, data: organizations, error } = authClient.useListOrganizations();

	if (isPending) return <p>Loading...</p>;

	if (error || !organizations) {
		return <p>{error?.message}</p>;
	}

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">Agency</Typography>
			{organizations.map((organization) => (
				<div key={organization.id}>
					<Typography variant="h2">{organization.name}</Typography>
				</div>
			))}
			<SignOutButton />
		</div>
	);
};

export default Agency;
