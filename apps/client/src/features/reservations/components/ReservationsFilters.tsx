import { RESERVATION_STATUS } from '@drivn/shared';
import { FunnelIcon } from '@phosphor-icons/react';
import { useSearchParams } from 'react-router';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function ReservationsFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateStatus = (value: string | null) => {
		const nextParams = new URLSearchParams(searchParams);
		if (value && value !== 'all') nextParams.set('status', value);
		else nextParams.delete('status');
		setSearchParams(nextParams);
	};

	return (
		<div className="flex items-center gap-1.5">
			<FunnelIcon className="size-4 text-muted-foreground" aria-hidden="true" />
			<span className="mr-1 text-xs font-medium text-muted-foreground">Filters</span>
			<Select value={searchParams.get('status') ?? 'all'} onValueChange={updateStatus}>
				<SelectTrigger>
					<SelectValue placeholder="Status: Any" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Status: Any</SelectItem>
					{RESERVATION_STATUS.map((status) => (
						<SelectItem key={status} value={status} className="capitalize">
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
