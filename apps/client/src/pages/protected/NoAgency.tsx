import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { BuildingsIcon, HouseIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';
import SignOutButton from '@/features/auth/components/SignOutButton';

const NoAgency = () => {
	const navigate = useNavigate();

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<BuildingsIcon className="size-8 text-muted-foreground" />
			<Typography variant="h3">You're not part of an agency yet</Typography>
			<Typography variant="body">
				Create your own agency or wait for an invitation from one.
			</Typography>
			<Button onClick={() => navigate('/agency/new')}>
				<HouseIcon data-icon="inline-start" />
				Create agency
			</Button>
			<SignOutButton />
		</div>
	);
};

export default NoAgency;
