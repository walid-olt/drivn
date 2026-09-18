import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';
import { Link } from 'react-router';

export function FleetNewHeader() {
	return (
		<div className="flex justify-between w-full items-center">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link to={'/agency/fleet'} />}>
							<Typography variant={'bodyStrong'}>Fleet</Typography>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>
							<Typography variant={'bodyStrong'}>new</Typography>
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Button role="link" render={<Link to={'/agency/fleet/'} />}>
				Cancel
			</Button>
		</div>
	);
}
