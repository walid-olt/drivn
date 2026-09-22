import { Button } from '@ui/button';
import { CarIcon } from '@phosphor-icons/react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@ui/empty';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router';
const EmptyFleet = () => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyTitle>
					<Typography variant={'h2'}>Your fleet is empty.</Typography>
				</EmptyTitle>
				<EmptyDescription>
					<Typography variant={'caption'}>
						You haven't added any car yet, Add a car to start receiving reservations
					</Typography>
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2">
				<Button role="link" render={<Link to={'/agency/fleet/new'} />}>
					<CarIcon />
					Add a car
				</Button>
			</EmptyContent>
		</Empty>
	);
};

export default EmptyFleet;
