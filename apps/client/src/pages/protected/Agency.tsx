import { Typography } from '@ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import { useAgencies } from '@/lib/auth-hooks';

const Agency = () => {
	const { isPending, isError, data: result, error } = useAgencies();

	if (isPending) return <p>Loading...</p>;

	if (isError || !result || result.error || !result.data) {
		return <p>{error?.message ?? result?.error?.message}</p>;
	}

	const organizations = result.data;

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
