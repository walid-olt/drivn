import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FunnelIcon } from '@phosphor-icons/react';
import { useSearchParams } from 'react-router';

const filters = [
	{
		key: 'status',
		label: 'Status',
		placeholder: 'Status: Any',
		options: ['available', 'rented', 'maintenance', 'inactive'],
	},
	{
		key: 'type',
		label: 'Type',
		placeholder: 'Type: Any',
		options: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'minivan', 'luxury'],
	},
	{
		key: 'transmission',
		label: 'Transmission',
		placeholder: 'Transmission: Any',
		options: ['automatic', 'manual', 'semi-automatic'],
	},
];

export function FleetFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateFilter = (key: string, value: string | null) => {
		const nextParams = new URLSearchParams(searchParams);
		if (value && value !== 'all') nextParams.set(key, value);
		else nextParams.delete(key);
		setSearchParams(nextParams);
	};

	return (
		<div className="flex items-center gap-1.5">
			<FunnelIcon className="size-4 text-muted-foreground" />
			<span className="mr-1 text-xs font-medium text-muted-foreground">Filters</span>
			{filters.map((filter) => (
				<Select
					key={filter.key}
					value={searchParams.get(filter.key) ?? 'all'}
					onValueChange={(value) => updateFilter(filter.key, value)}
				>
					<SelectTrigger size="default">
						<SelectValue placeholder={filter.placeholder} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{filter.placeholder}</SelectItem>
						{filter.options.map((value) => (
							<SelectItem key={value} value={value} className="capitalize">
								{value}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			))}
		</div>
	);
}
