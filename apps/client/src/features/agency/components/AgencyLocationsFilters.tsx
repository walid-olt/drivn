import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useAgencyLocationsStore } from '../stores/agency-locations.store';

type Props = {
	selectedCount: number;
};

const AgencyLocationsFilters = ({ selectedCount }: Props) => {
	const search = useAgencyLocationsStore((state) => state.search);
	const showSelectedOnly = useAgencyLocationsStore((state) => state.showSelectedOnly);
	const setSearch = useAgencyLocationsStore((state) => state.setSearch);
	const toggleSelectedOnly = useAgencyLocationsStore((state) => state.toggleSelectedOnly);

	return (
		<div className="flex flex-col gap-2 sm:flex-row">
			<div className="relative flex-1">
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
				className="h-9"
			>
				<FunnelIcon />
				Selected ({selectedCount})
			</Button>
		</div>
	);
};

export default AgencyLocationsFilters;
