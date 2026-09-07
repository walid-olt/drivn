import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { CheckCircleIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router';

export default function AgencySetupCompleted() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const requestedRedirect = new URLSearchParams(search).get('redirectTo');
	const redirectTo =
		requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//')
			? requestedRedirect
			: '/agency';

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
			<Logo />
			<CheckCircleIcon className="size-16 text-success" weight="fill" />
			<div className="space-y-2">
				<Typography variant="h1">Your agency is ready</Typography>
				<Typography variant="body">
					Your agency setup is complete. You can now start managing your fleet and bookings.
				</Typography>
			</div>
			<Button size="lg" onClick={() => navigate(redirectTo)}>
				Continue to your agency <ArrowRightIcon />
			</Button>
		</div>
	);
}
