import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import AgencyOnboardingFlow from '@/features/agency/components/AgencyOnboardingFlow';

export const Component = () => {
	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full px-4 lg:w-3/5 lg:mx-auto gap-y-12 py-4">
				<div className=" flex items-starts justify-center w-full gap-x-4">
					<Logo />
					<Separator orientation="vertical" />
					<Typography variant="h4">Onboarding</Typography>
				</div>

				<AgencyOnboardingFlow />
			</div>
		</div>
	);
};
