import { useState } from 'react';
import AsyncContainer from '@/components/AsyncContainer';
import Loading from '@/components/ui/Loading';
import { FieldError } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';
import LocationsTable from '../components/LocationsTable';
import { useAgencyLocationManagement, useUpdateAgencyLocations } from '../hooks';
import { useLocationFilters } from '../hooks/useLocationFilters';

function LocationsContent() {
	const { locations, selectedIds } = useAgencyLocationManagement();
	const [error, setError] = useState<string>();
	const filters = useLocationFilters(locations, selectedIds);
	const updateLocations = useUpdateAgencyLocations();

	const toggleLocation = async (id: string, selected: boolean) => {
		setError(undefined);
		const nextSelectedIds = new Set(selectedIds);
		if (selected) nextSelectedIds.add(id);
		else nextSelectedIds.delete(id);

		const [requestError] = await updateLocations.mutateAsync([...nextSelectedIds]);
		if (requestError) setError(requestError.message);
	};

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<div>
				<Typography variant="h3">Manage rental locations</Typography>
				<Typography variant="body">
					Choose where renters can pick up and return vehicles. Locations are managed centrally and
					are read-only here.
				</Typography>
			</div>
			<FieldError errors={[error ? { message: error } : undefined]} />
			<LocationsTable
				locations={filters.visibleLocations}
				selectedIds={selectedIds}
				onToggle={toggleLocation}
			/>
			<Typography variant="caption">
				{selectedIds.size} active location{selectedIds.size === 1 ? '' : 's'}
			</Typography>
		</div>
	);
}

export const Component = () => (
	<AsyncContainer
		loadingComponent={<Loading showIndicator message="Getting locations" className="h-64" />}
	>
		<LocationsContent />
	</AsyncContainer>
);
