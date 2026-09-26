import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Link, useNavigate } from 'react-router';

export function ReservationCreateHeader() {
	const navigate = useNavigate();

	return (
		<div className="flex w-full min-w-0 items-center justify-between gap-2">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link to="/agency/reservations" />}>
							<Typography variant="bodyStrong">Reservations</Typography>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>
							<Typography variant="bodyStrong">new</Typography>
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Button role="link" onClick={() => navigate(-1)}>
				Cancel
			</Button>
		</div>
	);
}
