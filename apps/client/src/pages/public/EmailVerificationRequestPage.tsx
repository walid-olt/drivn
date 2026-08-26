import { Typography } from '@/components/ui/typography';
import authClient from '@/lib/auth-client';
import { useSession } from '@/lib/auth-hooks';
import { toast } from '@/components/ui/toast';
import { Button } from '@ui/button';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function EmailVerificationRequestPage() {
	const searchParams = new URLSearchParams(window.location.search);
	const message = searchParams.get('message');
	useEffect(() => {
		if (message && message.trim().length > 0) {
			toast.add({
				title: message,
				type: 'info',
			});
		}
	}, [message]);

	const { isError, data: result, error, isPending } = useSession();

	const { mutate: sendVerificationEmail, isPending: isVerifing } = useMutation({
		mutationFn: (email: string) => authClient.sendVerificationEmail({ email }),
		onMutate: () => {
			toast.add({
				type: 'info',
				description: 'Sending verification email...',
			});
		},
		onSuccess: () => {
			toast.add({
				type: 'success',
				description: 'Verification email sent. Please check your inbox.',
			});
		},
	});

	if (isPending) return <p>Loading...</p>;

	if (isError || !result || result.error || !result.data) {
		return <p>{error?.message ?? result?.error?.message}</p>;
	}

	const user = result.data.user;

	if (user.emailVerified) return <p>Your email is already verified.</p>;

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1">Verify your email | {user.email} </Typography>
			<Button
				disabled={isVerifing}
				onClick={() => sendVerificationEmail(user.email)}
				className="flex items-center gap-2"
			>
				Verify Email
			</Button>
		</div>
	);
}
