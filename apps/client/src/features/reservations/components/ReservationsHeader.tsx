import { PlusIcon } from '@phosphor-icons/react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { Link } from 'react-router';
import { ReservationsFilters } from './ReservationsFilters';

export default function ReservationsHeader() {
	return (
		<div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<Typography variant="h4" className="shrink-0">Reservations</Typography>
			<div className="min-w-0 max-w-full overflow-x-auto">
				<ReservationsFilters />
			</div>
			<Button role="link" className="w-full shrink-0 lg:ml-auto lg:w-auto" render={<Link to="/agency/reservations/new" />}>
				<PlusIcon />
				New reservation
			</Button>
		</div>
	);
}
