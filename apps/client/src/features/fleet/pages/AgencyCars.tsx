import { useAgencyCars } from '../hooks';
import EmptyFleet from '../components/EmptyFleet';
import AsyncContainer from '@/components/AsyncContainer';
import { Spinner } from '@/components/ui/spinner';
import { FleetTable } from '../components/FleetTable';

const AgencyCars = () => {
	const { data } = useAgencyCars();

	const dataEmpty = data.length === 0;

	if (dataEmpty) {
		return <EmptyFleet />;
	}
	return <FleetTable cars={data} />;
};

export const Component = () => (
	<AsyncContainer loadingMessage={'Getting agency fleet'} loadingIndicator={<Spinner />}>
		<AgencyCars />
	</AsyncContainer>
);
