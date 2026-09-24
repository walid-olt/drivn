import { FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { LocationType } from '../hooks';
import { LocationTypeIcon } from './LocationTypeIcon';

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
	{ value: 'all', label: 'All location types' },
	{ value: 'airport', label: 'Airport' },
	{ value: 'office', label: 'Office' },
	{ value: 'hotel', label: 'Hotel' },
	{ value: 'train_station', label: 'Train station' },
	{ value: 'port', label: 'Port' },
	{ value: 'other', label: 'Other' },
];

type Props = {
	search: string;
	setSearch: (value: string) => void;
	type: LocationType;
	setType: (value: LocationType) => void;
	activeOnly: boolean;
	setActiveOnly: (value: boolean) => void;
	activeCount: number;
};

export default function LocationsFilters({
	search,
	setSearch,
	type,
	setType,
	activeOnly,
	setActiveOnly,
	activeCount,
}: Props) {
	return (
		<div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
			<div className="relative min-w-0 flex-1">
				<MagnifyingGlassIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search locations"
					className="h-9 w-full pl-8"
				/>
			</div>
			<Select value={type} onValueChange={(value) => setType(value as LocationType)}>
				<SelectTrigger className="h-9! w-44 shrink-0 snap-start">
					<SelectValue placeholder="All location types" />
				</SelectTrigger>
				<SelectContent>
					{LOCATION_TYPE_OPTIONS.map(({ value, label }) => (
						<SelectItem key={value} value={value}>
							{value === 'all' ? (
								<span className="size-4 shrink-0" aria-hidden="true" />
							) : (
								<LocationTypeIcon type={value} />
							)}
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button
				type="button"
				variant={activeOnly ? 'secondary' : 'outline'}
				onClick={() => setActiveOnly(!activeOnly)}
				className="h-9 shrink-0 snap-start"
			>
				<FunnelIcon />
				Active ({activeCount})
			</Button>
		</div>
	);
}
