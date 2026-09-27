import EmptyReservations from '../components/EmptyReservations';
import AsyncContainer from '@/components/AsyncContainer';
import { ReservationsTable } from '../components/ReservationsTable';
import { useReservationsData, useUpdateReservationStatusMutation } from '../hooks';
import { toast } from '@/components/ui/toast';
import { useSearchParams } from 'react-router';
import type { Reservation } from '@drivn/shared';
import Loading from '@/components/ui/Loading';

const useReservationFilters = (reservations: Reservation[]) => {
	const [searchParams] = useSearchParams();
	return reservations.filter((reservation) => {
		const status = searchParams.get('status');

		return !status || reservation.status === status;
	});
};

const Reservations = () => {
	const { reservations, cars, locations } = useReservationsData();
	const { mutateAsync: updateReservationStatus } = useUpdateReservationStatusMutation();
	const filteredReservations = useReservationFilters(reservations);

	if (reservations.length === 0) {
		return <EmptyReservations />;
	}

	const handleChangeStatus = async (reservation: Reservation, status: Reservation['status']) => {
		await toast.promise(
			updateReservationStatus({ id: reservation._id, status }).then(([error]) => {
				if (error) throw error;
				return status;
			}),
			{
				loading: `Updating reservation for ${reservation.renterName}...`,
				success: (updatedStatus) => `Reservation marked ${updatedStatus}.`,
				error: (error) =>
					error instanceof Error ? error.message : 'Unable to update reservation status.',
			},
		);
	};

	return (
		<ReservationsTable
			reservations={filteredReservations}
			cars={cars}
			locations={locations}
			onChangeStatus={handleChangeStatus}
			emptyMessage="No reservations match these filters."
		/>
	);
};

export const Component = () => (
	<AsyncContainer
		loadingComponent={
			<Loading showIndicator message={'Getting agency reservations'} className="h-64" />
		}
	>
		<Reservations />
	</AsyncContainer>
);
