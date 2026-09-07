import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { Location as AgencyLocation } from '@drivn/shared';
import {
	AirplaneIcon,
	BedIcon,
	BoatIcon,
	BuildingOfficeIcon,
	MapPinIcon,
	TrainIcon,
} from '@phosphor-icons/react';
import { useAgencyLocationsStore } from '../stores/agency-locations.store';

type Props = {
	locations: AgencyLocation[];
};

const normalizeSearchText = (value: string) =>
	value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

const LocationTypeIcon = ({ type }: { type: AgencyLocation['type'] }) => {
	const iconProps = {
		className: 'text-muted-foreground size-4 shrink-0',
	};

	switch (type) {
		case 'airport':
			return <AirplaneIcon {...iconProps} />;
		case 'hotel':
			return <BedIcon {...iconProps} />;
		case 'train_station':
			return <TrainIcon {...iconProps} />;
		case 'port':
			return <BoatIcon {...iconProps} />;
		case 'office':
			return <BuildingOfficeIcon {...iconProps} />;
		default:
			return <MapPinIcon {...iconProps} />;
	}
};

const AgencyLocationsTable = ({ locations }: Props) => {
	const search = useAgencyLocationsStore((state) => state.search);
	const selectedIds = useAgencyLocationsStore((state) => state.selectedIds);
	const showSelectedOnly = useAgencyLocationsStore((state) => state.showSelectedOnly);
	const toggleSelected = useAgencyLocationsStore((state) => state.toggleSelected);
	const setSelected = useAgencyLocationsStore((state) => state.setSelected);
	const normalizedSearch = normalizeSearchText(search.trim());
	const visibleLocations = locations.filter((location) => {
		const matchesSearch =
			!normalizedSearch ||
			[
				location.name,
				location.address,
				location.city,
				location.country,
				location.type.replace('_', ' '),
			].some((value) => normalizeSearchText(value).includes(normalizedSearch));
		return matchesSearch && (!showSelectedOnly || selectedIds.has(location._id));
	});

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12" />
						<TableHead>Location</TableHead>
						<TableHead>Address</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{visibleLocations.map((location) => {
						const isSelected = selectedIds.has(location._id);
						return (
							<TableRow
								key={location._id}
								data-state={isSelected ? 'selected' : undefined}
								className="cursor-pointer"
								onClick={() => toggleSelected(location._id)}
							>
								<TableCell>
									<Checkbox
										id={`location-${location._id}`}
										checked={isSelected}
										onCheckedChange={(checked) => setSelected(location._id, checked === true)}
										onClick={(event) => event.stopPropagation()}
									/>
								</TableCell>
								<TableCell>
									<label
										htmlFor={`location-${location._id}`}
										className="flex cursor-pointer items-center gap-2 font-medium"
										onClick={(event) => event.stopPropagation()}
									>
										<span title={location.type.replace('_', ' ')}>
											<LocationTypeIcon type={location.type} />
										</span>
										{location.name}
									</label>
								</TableCell>
								<TableCell className="max-w-[18rem]">
									<span
										className="block truncate"
										title={`${location.address}, ${location.city}, ${location.country}`}
									>
										{location.address}, {location.city}, {location.country}
									</span>
								</TableCell>
							</TableRow>
						);
					})}
					{visibleLocations.length === 0 && (
						<TableRow>
							<TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
								No locations match your search.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default AgencyLocationsTable;
