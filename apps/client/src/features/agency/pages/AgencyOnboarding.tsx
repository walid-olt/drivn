import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import AgencyOnboardingFlow from '@/features/agency/components/AgencyOnboardingFlow';
import type { Agency } from '@drivn/shared';
import { useLoaderData } from 'react-router';

export const Component = () => {
	const agency = useLoaderData<Agency>();
	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full px-4 lg:w-3/5 lg:mx-auto gap-y-12 py-4">
				<div className=" flex items-starts justify-center w-full gap-x-4">
					<Logo />
					<Separator orientation="vertical" />
					<Typography variant="h4">
						<strong className="font-black ">{agency.name}</strong> - Onboarding
					</Typography>
				</div>

				<AgencyOnboardingFlow agency={agency} />
			</div>
		</div>
	);
};
