import { Typography } from '@ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';

const Agency = () => {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">Agency</Typography>
			<SignOutButton />
		</div>
	);
};

export default Agency;
