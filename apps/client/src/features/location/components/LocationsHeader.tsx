import { Typography } from '@/components/ui/typography';
import LocationsFilters from './LocationsFilters';
import { useActiveLocationCount } from '../hooks';
import { useLocationFilterParams } from '../hooks/useLocationFilters';

export default function LocationsHeader() {
	const filters = useLocationFilterParams();
	const activeCount = useActiveLocationCount();

	return (
		<div className="flex w-full min-w-0 flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
			<Typography variant="h4" className="shrink-0">
				Locations
			</Typography>
			<div className="w-full min-w-0 lg:flex-1">
				<LocationsFilters {...filters} activeCount={activeCount} />
			</div>
		</div>
	);
}
