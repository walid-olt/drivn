import { useMemo } from 'react';
import type { Location as AgencyLocation } from '@drivn/shared';

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
} from '@/components/ui/combobox';
import {
	LocationTypeIcon,
	formatLocationType,
} from '@/features/location/components/LocationTypeIcon';

/**
 * Search matches on every field a renter might type: name, city, country and
 * the street address. Base UI derives the filter text from this function.
 */
const itemToStringLabel = (location: AgencyLocation) =>
	[location.name, location.city, location.country, location.address].filter(Boolean).join(' ');

/** Stable grouping so the popup never reshuffles between renders. */
const TYPE_ORDER: AgencyLocation['type'][] = [
	'airport',
	'train_station',
	'port',
	'hotel',
	'office',
	'other',
];

function groupByType(locations: AgencyLocation[]) {
	const groups = new Map<AgencyLocation['type'], AgencyLocation[]>();
	for (const location of locations) {
		const bucket = groups.get(location.type);
		if (bucket) bucket.push(location);
		else groups.set(location.type, [location]);
	}
	return TYPE_ORDER.filter((type) => groups.has(type)).map((type) => ({
		type,
		locations: groups.get(type) ?? [],
	}));
}

type LocationSelectorProps = {
	locations: AgencyLocation[];
	value: string | undefined;
	onChange: (locationId: string) => void;
	id: string;
	placeholder?: string;
	invalid?: boolean;
};

/**
 * @description
 * Locations are searchable and naturally categorised by type, so they use a
 * grouped combobox: type labels in the popup, and one text field that filters
 * across name, city, country and address at once. Pickup and drop-off both keep
 * the full list, since a round trip legitimately returns to the same location.
 */
export default function LocationSelector({
	locations,
	value,
	onChange,
	id,
	placeholder = 'Search locations',
	invalid,
}: LocationSelectorProps) {
	const groups = useMemo(() => groupByType(locations), [locations]);

	return (
		<Combobox
			items={locations}
			value={locations.find((location) => location._id === value) ?? null}
			onValueChange={(location) => onChange(location?._id ?? '')}
			itemToStringLabel={itemToStringLabel}
		>
			<ComboboxInput
				id={id}
				placeholder={placeholder}
				aria-invalid={invalid || undefined}
				showClear={!!value}
				className="w-full"
			/>
			<ComboboxContent>
				<ComboboxList>
					<ComboboxEmpty>No location found.</ComboboxEmpty>
					{groups.map(({ type, locations: groupLocations }) => (
						<ComboboxGroup key={type} items={groupLocations}>
							<ComboboxLabel>{formatLocationType(type)}</ComboboxLabel>
							{groupLocations.map((location) => (
								<ComboboxItem key={location._id} value={location} className="gap-2 py-2">
									<LocationTypeIcon type={location.type} />
									<span className="flex min-w-0 flex-col">
										<span className="truncate font-medium">{location.name}</span>
										<span className="truncate text-xs text-muted-foreground">
											{location.city}, {location.country}
										</span>
									</span>
								</ComboboxItem>
							))}
						</ComboboxGroup>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
