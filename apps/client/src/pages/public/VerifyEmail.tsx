import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { toast } from '@/components/ui/toast';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { resolvePostAuthPath } from '@/lib/auth-space';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

export default function VerifyEmail() {
	const token = new URLSearchParams(window.location.search).get('token');
	const navigate = useNavigate();

	const { mutate: verifyEmail, isPending, error } = useMutation({
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
			<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
				<Typography variant="h1">Invalid verification link</Typography>
				<Typography variant="body">This link is missing a verification token.</Typography>
				<Button nativeButton={false} render={<Link to="/verify-email/request" />} variant="outline">
					Request a new email
				</Button>
			</div>
		);
	}

	if (isPending) return <p>Verifying your email...</p>;

	if (error) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
				<Typography variant="h1">Verification failed</Typography>
				<Typography variant="body">
					{error.message ?? 'The link may have expired. Please request a new one.'}
				</Typography>
				<Button nativeButton={false} render={<Link to="/verify-email/request" />} variant="outline">
					Request a new email
				</Button>
			</div>
		);
	}

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">Your email has been verified</Typography>
			<Typography variant="body">Redirecting you to your dashboard...</Typography>
		</div>
	);
}
