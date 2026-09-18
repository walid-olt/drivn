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
import { Link, useNavigate } from 'react-router';

export function FleetNewHeader() {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);
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
			<Button role="link" onClick={goBack}>
				Cancel
			</Button>
		</div>
	);
}
