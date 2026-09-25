import { Button } from '@ui/button';
import { PlusIcon } from '@phosphor-icons/react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@ui/empty';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router';

const EmptyReservations = () => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyTitle>
					<Typography variant={'h2'}>No reservations yet.</Typography>
				</EmptyTitle>
				<EmptyDescription>
					<Typography variant={'caption'}>
						You haven't added any reservations yet. Create a reservation to start managing bookings.
					</Typography>
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2">
				<Button role="link" render={<Link to={'/agency/reservations/new'} />}>
					<PlusIcon />
					New reservation
				</Button>
			</EmptyContent>
		</Empty>
	);
};

export default EmptyReservations;
