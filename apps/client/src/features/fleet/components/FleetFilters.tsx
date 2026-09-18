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
		options: [
			['available', 'Available'],
			['rented', 'Rented'],
			['maintenance', 'Maintenance'],
			['inactive', 'Inactive'],
		],
	},
	{
		key: 'type',
		label: 'Type',
		placeholder: 'Type: Any',
		options: [
			['sedan', 'Sedan'],
			['suv', 'SUV'],
			['hatchback', 'Hatchback'],
			['coupe', 'Coupe'],
			['convertible', 'Convertible'],
			['minivan', 'Minivan'],
			['luxury', 'Luxury'],
		],
	},
	{
		key: 'transmission',
		label: 'Transmission',
		placeholder: 'Transmission: Any',
		options: [
			['automatic', 'Automatic'],
			['manual', 'Manual'],
			['semi-automatic', 'Semi-automatic'],
		],
	},
] as const;

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
			<FunnelIcon className="size-4 text-muted-foreground" aria-hidden="true" />
			<span className="mr-1 text-xs font-medium text-muted-foreground">Filters</span>
			{filters.map((filter) => (
				<Select
					key={filter.key}
					value={searchParams.get(filter.key) ?? 'all'}
					onValueChange={(value) => updateFilter(filter.key, value)}
				>
					<SelectTrigger aria-label={filter.label} size="sm">
						<SelectValue placeholder={filter.placeholder} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{filter.placeholder}</SelectItem>
						{filter.options.map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			))}
		</div>
	);
}
