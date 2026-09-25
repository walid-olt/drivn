import { PlusIcon } from '@phosphor-icons/react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { Link } from 'react-router';
import { ReservationsFilters } from './ReservationsFilters';

export default function ReservationsHeader() {
	return (
		<div className="relative flex w-full items-center justify-between">
			<Typography variant="h4">Reservations</Typography>
			<div className="absolute left-1/2 -translate-x-1/2">
				<ReservationsFilters />
			</div>
			<Button role="link" className="ml-auto" render={<Link to="/agency/reservations/new" />}>
				<PlusIcon />
				New reservation
			</Button>
		</div>
	);
}
