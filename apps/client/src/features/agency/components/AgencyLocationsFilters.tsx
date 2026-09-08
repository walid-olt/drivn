import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useAgencyLocationsStore } from '../stores/agency-locations.store';

const AgencyLocationsFilters = () => {
	const search = useAgencyLocationsStore((state) => state.search);
	const showSelectedOnly = useAgencyLocationsStore((state) => state.showSelectedOnly);
	const setSearch = useAgencyLocationsStore((state) => state.setSearch);
	const toggleSelectedOnly = useAgencyLocationsStore((state) => state.toggleSelectedOnly);
	const selected = useAgencyLocationsStore((s) => s.selectedIds);

	return (
		<div className="flex min-w-0 flex-1 gap-2">
			<div className="relative min-w-0 flex-1">
				<MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search by location, city, country, or type"
					className="h-9 pl-8"
				/>
			</div>
			<Button
				type="button"
				variant={showSelectedOnly ? 'secondary' : 'outline'}
				onClick={toggleSelectedOnly}
				className="h-9 shrink-0"
			>
				<FunnelIcon />
				Selected ({selected.size})
			</Button>
		</div>
	);
};

export default AgencyLocationsFilters;
