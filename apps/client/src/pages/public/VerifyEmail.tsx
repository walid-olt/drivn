import { CheckCircleIcon, SpinnerIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@ui/button';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { resolvePostAuthPath } from '@/lib/auth-space';
import { cn } from '@/lib/utils';

function VerifyEmailStatus({
	icon,
	title,
	description,
	children,
	className,
}: {
	icon: ReactNode;
	title: string;
	description: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				'mx-auto flex w-full max-w-md flex-col items-center gap-3 py-20 text-center',
				className,
			)}
		>
			<div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
				<div className="flex flex-col items-center gap-2">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						{icon}
					</div>
					<Typography variant="h4">{title}</Typography>
					<Typography variant="body">{description}</Typography>
					{children && <div className="mt-2">{children}</div>}
				</div>
			</div>
		</section>
	);
}

export default function VerifyEmail() {
	const token = new URLSearchParams(window.location.search).get('token');
	const navigate = useNavigate();

	const {
		mutate: verifyEmail,
		isPending,
		error,
	} = useMutation({
		mutationFn: (token: string) => authClient.verifyEmail({ query: { token } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			toast.add({
				type: 'success',
				description: 'Your email has been verified.',
			});
			navigate(await resolvePostAuthPath());
		},
	});

	useEffect(() => {
		if (token) verifyEmail(token);
	}, [token, verifyEmail]);

	if (!token) {
		return (
			<VerifyEmailStatus
				icon={<WarningCircleIcon className="size-6 text-foreground" />}
				title="Invalid verification link"
				description="This link is missing a verification token."
			>
				<Button nativeButton={false} render={<Link to="/verify-email/request" />} variant="outline">
					Request a new email
				</Button>
			</VerifyEmailStatus>
		);
	}

	if (isPending) {
		return (
			<VerifyEmailStatus
				icon={<SpinnerIcon className="size-6 animate-spin text-muted-foreground" />}
				title="Verifying your email"
				description="Please wait while we confirm your email address..."
			/>
		);
	}

	if (error) {
		return (
			<VerifyEmailStatus
				icon={<WarningCircleIcon className="size-6 text-destructive" />}
				title="Verification failed"
				description={error.message ?? 'The link may have expired. Please request a new one.'}
			>
				<Button nativeButton={false} render={<Link to="/verify-email/request" />} variant="outline">
					Request a new email
				</Button>
			</VerifyEmailStatus>
		);
	}

	return (
		<VerifyEmailStatus
			icon={<CheckCircleIcon className="size-6 text-primary" weight="fill" />}
			title="Your email has been verified"
			description="Redirecting you to your dashboard..."
		/>
	);
}
