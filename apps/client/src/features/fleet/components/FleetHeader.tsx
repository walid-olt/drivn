import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { CarIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

const FleetHeader = () => {
	return (
		<div className="flex justify-between w-full items-center">
			<Typography variant={'bodyStrong'}>Fleet</Typography>
			<Button role="link" render={<Link to={'/agency/fleet/new'} />}>
				<CarIcon />
				Add a car
			</Button>
		</div>
	);
};

export default FleetHeader;
