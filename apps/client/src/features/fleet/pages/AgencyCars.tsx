import EmptyFleet from '../components/EmptyFleet';
import AsyncContainer from '@/components/AsyncContainer';
import { Spinner } from '@/components/ui/spinner';
import { FleetTable } from '../components/FleetTable';
import { useAgencyCars, useUpdateCarStatusMutation } from '../hooks';
import { toast } from '@/components/ui/toast';
import { useSearchParams } from 'react-router';
import type { Car } from '@drivn/shared';

const useCarFilters = (cars: Car[]) => {
	const [searchParams] = useSearchParams();
	return cars.filter((car) => {
		const status = searchParams.get('status');
		const type = searchParams.get('type');
		const transmission = searchParams.get('transmission');

		return (
			(!status || car.status === status) &&
			(!type || car.category === type) &&
			(!transmission || car.transmission === transmission)
		);
	});
};
const AgencyCars = () => {
	const { data } = useAgencyCars();
	const { mutateAsync: updateCarStatus } = useUpdateCarStatusMutation();
	const filteredCars = useCarFilters(data);
	if (data.length === 0) {
		return <EmptyFleet />;
	}

	const handleChangeStatus = async (
		car: (typeof data)[number],
		status: 'available' | 'rented' | 'maintenance' | 'inactive',
	) => {
		await toast.promise(
			updateCarStatus({ id: car._id, status }).then(([error]) => {
				if (error) throw error;
				return status;
			}),
			{
				loading: `Updating ${car.make} ${car.model}...`,
				success: (updatedStatus) => `${car.make} ${car.model} marked ${updatedStatus}.`,
				error: (error) => (error instanceof Error ? error.message : 'Unable to update car status.'),
			},
		);
	};

	return (
		<FleetTable
			cars={filteredCars}
			onChangeStatus={handleChangeStatus}
			emptyMessage="No vehicles match these filters."
		/>
	);
};

export const Component = () => (
	<AsyncContainer loadingMessage={'Getting agency fleet'} loadingIndicator={<Spinner />}>
		<AgencyCars />
	</AsyncContainer>
);
