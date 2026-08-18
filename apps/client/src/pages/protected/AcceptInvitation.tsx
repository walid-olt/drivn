import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Typography } from '@/components/ui/typography';
import { SpinnerIcon } from '@phosphor-icons/react';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { toast } from '@/components/ui/toast';

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
				await queryClient.invalidateQueries({ queryKey: ['session'] });
				toast.add({ type: 'success', title: 'Invitation accepted!' });
				navigate('/agency');
			})
			.catch(() => {
				setStatus('error');
				setErrorMessage('Something went wrong. Please try again.');
			});
	}, [invitationId, navigate]);

	return (
		<section className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				{status === 'loading' && (
					<>
						<SpinnerIcon className="size-8 animate-spin" />
						<Typography variant="h3">Accepting invitation...</Typography>
					</>
				)}
				{status === 'error' && (
					<>
						<Typography variant="h3">Could not accept invitation</Typography>
						<Typography variant="body">{errorMessage}</Typography>
					</>
				)}
			</div>
		</section>
	);
}
