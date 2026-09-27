import {
	ArrowUpRightIcon,
	CalendarCheckIcon,
	CalendarDotsIcon,
	CurrencyCircleDollarIcon,
	GaugeIcon,
	CarIcon,
	KeyIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router';
import type { Icon } from '@phosphor-icons/react';

import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { AgencyKpi, AgencyKpiId } from '../hooks';

const KPI_ICONS: Record<AgencyKpiId, Icon> = {
	fleet: CarIcon,
	available: KeyIcon,
	utilization: GaugeIcon,
	activeRentals: CalendarCheckIcon,
	upcomingPickups: CalendarDotsIcon,
	bookedValue: CurrencyCircleDollarIcon,
};

const KPI_TONES: Record<AgencyKpiId, string> = {
	fleet: 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400',
	available: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
	utilization: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
	activeRentals: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400',
	upcomingPickups: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
	bookedValue: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

type KpiCardProps = {
	kpi: AgencyKpi;
};

function KpiCard({ kpi }: KpiCardProps) {
	const Icon = KPI_ICONS[kpi.id];

	return (
		<Card
			size="sm"
			className="relative gap-3 transition-colors hover:bg-accent/40 focus-within:ring-2 focus-within:ring-ring"
		>
			<div className="flex items-start justify-between gap-3 px-(--card-spacing)">
				<div className="flex min-w-0 flex-col gap-1">
					<Typography variant="caption" className="truncate">
						{kpi.label}
					</Typography>
					<Typography as="p" variant="h3" className="truncate text-3xl font-medium tabular-nums">
						{kpi.value}
					</Typography>
				</div>
				<span
					className={cn(
						'flex size-9 shrink-0 items-center justify-center rounded-lg',
						KPI_TONES[kpi.id],
					)}
				>
					<Icon className="size-5" />
				</span>
			</div>

			<div className="flex items-center justify-between gap-2 border-t px-(--card-spacing) pt-3">
				<Typography variant="caption" className="truncate text-xs">
					{kpi.hint}
				</Typography>
				<ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground" />
			</div>

			{/* Stretched link keeps the whole card clickable without nesting interactive elements. */}
			<Link to={kpi.to} className="absolute inset-0">
				<span className="sr-only">
					{kpi.label}: {kpi.value}
				</span>
			</Link>
		</Card>
	);
}

type AgencyKpisProps = {
	kpis: AgencyKpi[];
};

export default function AgencyKpis({ kpis }: AgencyKpisProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{kpis.map((kpi) => (
				<KpiCard key={kpi.id} kpi={kpi} />
			))}
		</div>
	);
}
