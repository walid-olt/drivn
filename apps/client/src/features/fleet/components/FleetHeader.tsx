import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { CarIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { FleetFilters } from './FleetFilters';

const FleetHeader = () => {
	return (
		<div className="relative flex w-full items-center justify-between">
			<Typography variant={'bodyStrong'}>Fleet</Typography>
			<div className="absolute left-1/2 -translate-x-1/2">
				<FleetFilters />
			</div>
			<Button role="link" className={'ml-auto'} render={<Link to={'/agency/fleet/new'} />}>
				<CarIcon />
				Add a car
			</Button>
		</div>
	);
};

export default FleetHeader;
