import { SealCheckIcon, UserIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@ui/button';
import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';
import { useSession } from '@/lib/auth-hooks';

export default function Profile() {
	const { isPending, isError, data: result, error } = useSession();

	if (isPending) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<Typography variant="h3">Loading...</Typography>
				</div>
			</AuthLayout>
		);
	}

	if (isError || !result || result.error || !result.data) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<Typography variant="h3">Something went wrong</Typography>
					<Typography variant="body">
						{error?.message ?? result?.error?.message ?? 'Unable to load your profile.'}
					</Typography>
				</div>
			</AuthLayout>
		);
	}

	const { user } = result.data;

	return (
		<AuthLayout>
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
					<UserIcon className="size-7 text-primary" weight="fill" />
				</div>

				<div className="flex flex-col gap-1">
					<Typography variant="h3">{user.name}</Typography>
					<Typography variant="body">{user.email}</Typography>
				</div>

				<div className="flex items-center gap-2">
					<span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">
						{(user as any).type}
					</span>
					{user.emailVerified ? (
						<span className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
							<SealCheckIcon className="size-3.5 text-primary" weight="fill" />
							Verified
						</span>
					) : (
						<span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
							Unverified
						</span>
					)}
				</div>

				<div className="mt-2 flex w-full flex-col gap-2">
					<SignOutButton className="w-full" />
					<Button nativeButton={false} render={<Link to="/" />} variant="ghost" size="lg">
						Back to home
					</Button>
				</div>
			</div>
		</AuthLayout>
	);
}
