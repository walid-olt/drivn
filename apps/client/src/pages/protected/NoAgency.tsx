import { BuildingsIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import SignOutButton from '@/features/auth/components/SignOutButton';

const NoAgency = () => {
	const navigate = useNavigate();

	return (
		<AuthLayout>
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-muted">
					<BuildingsIcon className="size-7 text-muted-foreground" />
				</div>

				<div className="flex flex-col gap-1">
					<Typography variant="h3">You're not part of an agency yet</Typography>
					<Typography variant="body">
						Create your own agency or wait for an invitation from one.
					</Typography>
				</div>

				<div className="mt-2 flex w-full flex-col gap-2">
					<Button onClick={() => navigate('/agency/new')} size="lg">
						<BuildingsIcon data-icon="inline-start" />
						Create agency
					</Button>
					<SignOutButton className="w-full" />
				</div>
			</div>
		</AuthLayout>
	);
};

export default NoAgency;
