import AsyncContainer from '@/components/AsyncContainer';
import Loading from '@/components/ui/Loading';
import { Typography } from '@/components/ui/typography';
import AgencyBanner from '../components/AgencyBanner';
import AgencyKpis from '../components/AgencyKpis';
import { useAgencyOverview } from '../hooks';

function AgencyOverview() {
	const { agency, kpis } = useAgencyOverview();

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<AgencyBanner agency={agency} />
			<AgencyKpis kpis={kpis} />
			<Typography variant="caption" className="text-center">
				Overview figures are derived from your live fleet and reservations.
			</Typography>
		</div>
	);
}

export const Component = () => (
	<AsyncContainer
		loadingComponent={<Loading showIndicator message="Building your overview" className="h-64" />}
	>
		<AgencyOverview />
	</AsyncContainer>
);
