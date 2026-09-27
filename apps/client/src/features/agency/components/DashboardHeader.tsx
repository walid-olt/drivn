import { ChartLineUpIcon } from '@phosphor-icons/react';

import { Typography } from '@/components/ui/typography';

export default function DashboardHeader() {
	return (
		<div className="flex w-full items-center gap-2">
			<ChartLineUpIcon className="size-4 text-muted-foreground" />
			<Typography variant="h4">Dashboard</Typography>
		</div>
	);
}
