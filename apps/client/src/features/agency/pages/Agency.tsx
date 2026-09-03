import { BuildingsIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@ui/button';
import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import { useAgency } from '@/lib/auth-hooks';

export const Component = () => {
	const { isPending, data: agency, error, isError } = useAgency();

	if (isPending) {
		return (
			<AuthLayout>
				<Typography variant="h3" className="text-center">
					Loading...
				</Typography>
			</AuthLayout>
		);
	}

	if (isError || error) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<Typography variant="h3">Something went wrong</Typography>
					<Typography variant="body">{error.message}</Typography>
				</div>
			</AuthLayout>
		);
	}
	return (
		<div className="flex flex-col items-center gap-6 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
				<BuildingsIcon className="size-7 text-primary" weight="fill" />
			</div>

			<div className="flex flex-col gap-1">
				<Typography variant="h3">Your agency</Typography>
				<Typography variant="body">{agency.name}</Typography>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2">
				<SignOutButton className="w-full" />
				<Button nativeButton={false} render={<Link to="/" />} variant="ghost" size="lg">
					Back to home
				</Button>
			</div>
		</div>
	);
};
