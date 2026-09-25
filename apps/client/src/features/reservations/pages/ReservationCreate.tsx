import AsyncContainer from '@/components/AsyncContainer';
import Loading from '@/components/ui/Loading';
import ReservationCreateForm from '../components/ReservationCreateForm';
import { useReservationCreateData } from '../hooks';

function ReservationCreateContent() {
	const { cars, locations } = useReservationCreateData();

	return (
		<section className="flex items-center">
			<ReservationCreateForm cars={cars} locations={locations} />
		</section>
	);
}

export const Component = () => (
	<AsyncContainer
		loadingComponent={
			<Loading showIndicator message="Getting reservation details" className="h-64" />
		}
	>
		<ReservationCreateContent />
	</AsyncContainer>
);
