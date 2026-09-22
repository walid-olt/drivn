import { EnvelopeSimpleIcon, SpinnerIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@ui/button';
import { Typography } from '@/components/ui/typography';
import authClient from '@/lib/auth-client';
import { useSession } from '@/lib/auth-hooks';
import { resolvePostAuthPath } from '@/lib/auth-space';
import { useNavigate } from 'react-router';

export default function EmailVerificationRequestPage() {
	const redirectTo = localStorage.getItem('redirectTo');
	const { isError, data: session, error, isPending } = useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (session?.user.emailVerified) {
			void (async () => {
				navigate(redirectTo || (await resolvePostAuthPath()), { replace: true });
			})();
		}
	}, [navigate, redirectTo, session]);

	const {
		mutate: sendVerificationEmail,
		isPending: isVerifying,
		isSuccess: isEmailVerificationSent,
	} = useMutation({
		mutationFn: (email: string) =>
			authClient.sendVerificationEmail({
				email,
			}),
	});

	if (isPending) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
					</div>
					<Typography variant="h3">Loading...</Typography>
				</div>
			</AuthLayout>
		);
	}

	if (isError || !session) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<EnvelopeSimpleIcon className="size-6 text-muted-foreground" />
					</div>
					<Typography variant="h3">Something went wrong</Typography>
					<Typography variant="body">
						{error?.message ?? 'Unable to check your account.'}
					</Typography>
				</div>
			</AuthLayout>
		);
	}

	const user = session.user;

	if (user.emailVerified) {
		return null;
	}

	return (
		<AuthLayout>
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-muted">
					<EnvelopeSimpleIcon className="size-6 text-primary" weight="fill" />
				</div>
				<Typography variant="h3">Verify your email</Typography>
				<Typography variant="body">We'll send a verification link to:</Typography>
				<span className="break-all rounded-md border border-border bg-input/20 px-3 py-1.5 font-medium text-foreground">
					{user.email}
				</span>
				<Typography variant="body">
					Check your inbox and click the link to activate your account.
				</Typography>
				<Button
					disabled={isVerifying || isEmailVerificationSent}
					onClick={() => sendVerificationEmail(user.email)}
					className="mt-2 w-full"
					size="lg"
				>
					{!isVerifying && !isEmailVerificationSent && 'Send verification email'}
					{isVerifying && !isEmailVerificationSent && <SpinnerIcon className="animate-spin" />}
					{isVerifying && 'Sending...'}
					{!isVerifying &&
						isEmailVerificationSent &&
						'Email verification was sent, check your inbox.'}
				</Button>
			</div>
		</AuthLayout>
	);
}
