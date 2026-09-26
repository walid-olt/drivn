import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { CarIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { FleetFilters } from './FleetFilters';

const FleetHeader = () => {
	return (
		<div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<Typography variant="h4" className="shrink-0">Fleet</Typography>
			<div className="min-w-0 max-w-full overflow-x-auto">
				<FleetFilters />
			</div>
			<Button role="link" className="w-full shrink-0 lg:ml-auto lg:w-auto" render={<Link to={'/agency/fleet/new'} />}>
				<CarIcon />
				Add a car
			</Button>
		</div>
	);
};

export default FleetHeader;
