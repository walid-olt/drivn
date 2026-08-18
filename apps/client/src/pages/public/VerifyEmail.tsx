import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Typography } from '@/components/ui/typography';
import { SpinnerIcon } from '@phosphor-icons/react';
import authClient from '@/lib/auth-client';

export default function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const token = searchParams.get('token');

		if (!token) {
			setStatus('error');
			setErrorMessage('No verification token provided.');
			return;
		}

		authClient
			.verifyEmail({ token })
			.then(({ error }) => {
				if (error) {
					setStatus('error');
					setErrorMessage(error.message ?? 'Verification failed.');
					return;
				}
				setStatus('success');
				setTimeout(() => navigate('/login?message=Email verified. You can now sign in.'), 2000);
			})
			.catch(() => {
				setStatus('error');
				setErrorMessage('Something went wrong. Please try again.');
			});
	}, [searchParams, navigate]);

	return (
		<section className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				{status === 'loading' && (
					<>
						<SpinnerIcon className="size-8 animate-spin" />
						<Typography variant="h3">Verifying your email...</Typography>
					</>
				)}
				{status === 'success' && (
					<Typography variant="h3">Email verified! Redirecting to login...</Typography>
				)}
				{status === 'error' && (
					<>
						<Typography variant="h3">Verification failed</Typography>
						<Typography variant="body">{errorMessage}</Typography>
					</>
				)}
			</div>
		</section>
	);
}
