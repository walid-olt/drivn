import { BuildingsIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@ui/button';
import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import { useAgencies } from '@/lib/auth-hooks';

const Agency = () => {
	const { isPending, isError, data: result, error } = useAgencies();

	if (isPending) {
		return (
			<AuthLayout>
				<Typography variant="h3" className="text-center">
					Loading...
				</Typography>
			</AuthLayout>
		);
	}

	if (isError || !result || result.error || !result.data) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<Typography variant="h3">Something went wrong</Typography>
					<Typography variant="body">
						{error?.message ?? result?.error?.message ?? 'Unable to load your agencies.'}
					</Typography>
				</div>
			</AuthLayout>
		);
	}

	const organizations = result.data;

	return (
		<AuthLayout>
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
					<BuildingsIcon className="size-7 text-primary" weight="fill" />
				</div>

				<div className="flex flex-col gap-1">
					<Typography variant="h3">Your agencies</Typography>
					<Typography variant="body">
						{organizations.length > 0
							? 'Agencies you are a member of.'
							: 'You are not part of any agency yet.'}
					</Typography>
				</div>

				{organizations.length > 0 && (
					<ul className="flex w-full flex-col gap-2">
						{organizations.map((organization) => (
							<li key={organization.id}>
								<div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-left">
									<BuildingsIcon className="size-4 shrink-0 text-muted-foreground" />
									<span className="text-sm font-medium">{organization.name}</span>
								</div>
							</li>
						))}
					</ul>
				)}

				<div className="mt-2 flex w-full flex-col gap-2">
					<SignOutButton className="w-full" />
					<Button nativeButton={false} render={<Link to="/" />} variant="ghost" size="lg">
						Back to home
					</Button>
				</div>
			</div>
		</AuthLayout>
	);
};

export default Agency;
