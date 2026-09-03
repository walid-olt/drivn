import React, { useState, lazy, Suspense } from 'react';
import {
	Stepper,
	StepperContent,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTitle,
} from '@/components/reui/stepper';

import {
	CheckIcon,
	CircleNotchIcon,
	HeadsetIcon,
	MapPinAreaIcon,
	PaintBrushIcon,
} from '@phosphor-icons/react';
import type { Agency } from '@drivn/shared';
import AgencyFormSkeleton from './AgencyFormSkeleton.tsx';

type OnboardingStep = {
	title: Agency['onboardingStatus'];
	icon: React.ReactNode;
	// lazy load the form component for each step
	// each form component should accept an onSuccess/onSubmit
	// callback that will be called when the form is successfully submitted
	Form?: React.LazyExoticComponent<
		React.ComponentType<{ onSuccess: VoidFunction; onSubmit: VoidFunction }>
	>;
};
const steps: OnboardingStep[] = [
	{
		title: 'branding',
		icon: <PaintBrushIcon strokeWidth={2} className="size-4" />,
		Form: lazy(() => import('./AgencyBrandingForm')),
	},
	{
		title: 'support',
		icon: <HeadsetIcon strokeWidth={2} className="size-4" />,
		Form: lazy(() => import('./AgencySupportForm')),
	},
	{
		title: 'locations',
		icon: <MapPinAreaIcon strokeWidth={2} className="size-4" />,
		Form: lazy(() => import('./AgencyLocationsForm.tsx')),
	},
];

export default function AgencyOnBoardingFlow() {
	const [currentStep, setCurrentStep] = useState(0);
	const [currentLoading, setcurrentLoading] = useState(-1);

	return (
		<Stepper
			value={currentStep}
			onValueChange={setCurrentStep}
			indicators={{
				completed: <CheckIcon strokeWidth={2} className="size-3.5" />,
				loading: <CircleNotchIcon strokeWidth={2} className="size-3.5 animate-spin" />,
			}}
			className="space-y-8 "
		>
			<StepperNav
				className="gap-3 justify-center items-center sticky top-0 py-4
        outline outline-primary/20 px-2
        z-9999 rounded-sm bg-background backdrop-blur-2xl w-full"
			>
				{steps.map((step, index) => (
					<StepperItem
						key={index}
						loading={currentLoading === index}
						step={index}
						className="relative items-center"
					>
						<div className="flex grow flex-col items-start justify-center gap-2.5">
							<StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
								{step.icon}
							</StepperIndicator>
							<div className="flex flex-col items-start gap-1 px-2">
								<div className="text-muted-foreground text-[10px] font-semibold uppercase">
									Step {index + 1}
								</div>
								<StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold">
									{step.title}
								</StepperTitle>
							</div>
						</div>

						{steps.length > index + 1 && (
							<StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 inset-s-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
						)}
					</StepperItem>
				))}
			</StepperNav>

			<StepperPanel className="text-sm">
				{steps.map((step, index) => {
					const Form = step.Form;
					return Form ? (
						<StepperContent key={index} value={index}>
							<Suspense fallback={<AgencyFormSkeleton />}>
								<Form
									onSuccess={() => {
										setCurrentStep(index + 1);
										setcurrentLoading(-1);
									}}
									onSubmit={() => setcurrentLoading(index)}
								/>
							</Suspense>
						</StepperContent>
					) : null;
				})}
			</StepperPanel>
		</Stepper>
	);
}
