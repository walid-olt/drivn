import { Typography } from '@/components/ui/typography';
import LocationsFilters from './LocationsFilters';
import { useActiveLocationCount } from '../hooks';
import { useLocationFilterParams } from '../hooks/useLocationFilters';

export default function LocationsHeader() {
	const filters = useLocationFilterParams();
	const activeCount = useActiveLocationCount();

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<Typography variant="h4" className="shrink-0">
				Locations
			</Typography>
			<LocationsFilters {...filters} activeCount={activeCount} />
		</div>
	);
}
