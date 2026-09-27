import { useState } from 'react';
import type { Location as AgencyLocation } from '@drivn/shared';
import { CheckIcon, SpinnerIcon } from '@phosphor-icons/react';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { LocationTypeIcon, formatLocationType } from './LocationTypeIcon';

type Props = {
	locations: AgencyLocation[];
	selectedIds: Set<string>;
	onToggle: (id: string, selected: boolean) => Promise<void>;
};

export default function LocationsTable({ locations, selectedIds, onToggle }: Props) {
	const [pendingId, setPendingId] = useState<string>();

	const toggle = async (id: string, selected: boolean) => {
		setPendingId(id);
		try {
			await onToggle(id, selected);
		} finally {
			setPendingId(undefined);
		}
	};

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12" />
						<TableHead>Location</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Type</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{locations.map((location) => {
						const isSelected = selectedIds.has(location._id);
						const isPending = pendingId === location._id;
						return (
							<TableRow key={location._id} data-state={isSelected ? 'selected' : undefined}>
								<TableCell>
									<Checkbox
										id={`location-${location._id}`}
										checked={isSelected}
										disabled={isPending}
										onCheckedChange={(checked) => void toggle(location._id, checked === true)}
									/>
								</TableCell>
								<TableCell>
									<label htmlFor={`location-${location._id}`} className="flex items-center gap-2">
										<LocationTypeIcon type={location.type} />
										<span className="font-medium">{location.name}</span>
										{isPending ? (
											<SpinnerIcon className="size-3.5 animate-spin text-muted-foreground" />
										) : isSelected ? (
											<CheckIcon className="size-3.5 text-primary" />
										) : null}
									</label>
								</TableCell>
								<TableCell className="max-w-[24rem]">
									<span
										className="block truncate"
										title={`${location.address}, ${location.city}, ${location.country}`}
									>
										{location.address}, {location.city}, {location.country}
									</span>
								</TableCell>
								<TableCell className="capitalize">{formatLocationType(location.type)}</TableCell>
							</TableRow>
						);
					})}
					{locations.length === 0 && (
						<TableRow>
							<TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
								No locations match these filters.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
