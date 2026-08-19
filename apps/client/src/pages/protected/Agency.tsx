import { Typography } from '@ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import useOrganizations from '@/lib/auth-hooks';

const Agency = () => {
	//TODO: refactor this - delegate the loading/error state to Suspense and Error Boundaries
	const { isPending, data, error } = useOrganizations();

	if (isPending) return <p>Loading...</p>;

	if (error) {
		return <p>{error.message}</p>;
	}

	const { error: authError, data: organizations } = data;

	if (authError) {
		return <p>{authError.message}</p>;
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
