import { CheckCircleIcon, SpinnerIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';

export default function AcceptInvitation() {
	const { invitationId } = useParams<{ invitationId: string }>();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (!invitationId) {
			setStatus('error');
			setErrorMessage('No invitation ID provided.');
			return;
		}

		setStatus('loading');
		authClient.organization
			.acceptInvitation({ invitationId })
			.then(async ({ error }) => {
				if (error) {
					setStatus('error');
					setErrorMessage(error.message ?? 'Failed to accept invitation.');
					return;
				}
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ['session'] }),
					queryClient.removeQueries({ queryKey: ['agencies'] }),
				]);
				toast.add({ type: 'success', title: 'Invitation accepted!' });
				navigate('/agency');
			})
			.catch(() => {
				setStatus('error');
				setErrorMessage('Something went wrong. Please try again.');
			});
	}, [invitationId, navigate]);

	return (
		<AuthLayout>
			<div className="flex flex-col items-center gap-3 text-center">
				{status === 'loading' && (
					<>
						<div className="flex size-12 items-center justify-center rounded-full bg-muted">
							<SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
						</div>
						<Typography variant="h3">Accepting invitation...</Typography>
					</>
				)}
				{status === 'error' && (
					<>
						<div className="flex size-12 items-center justify-center rounded-full bg-muted">
							<WarningCircleIcon className="size-6 text-destructive" />
						</div>
						<Typography variant="h3">Could not accept invitation</Typography>
						<Typography variant="body">{errorMessage}</Typography>
					</>
				)}
				{status === 'idle' && <CheckCircleIcon className="size-6 text-muted-foreground" />}
			</div>
		</AuthLayout>
	);
}
