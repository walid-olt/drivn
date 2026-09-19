import { createCarFormSchema } from '@drivn/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { SpinnerIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';
import { useCreateCarMutation } from '../hooks';
import IdentifiersSection from './create-car-form-sections/IdentifiersSection';
import ImagesSection from './create-car-form-sections/ImagesSection';
import PricingStatusSection from './create-car-form-sections/PricingStatusSection';
import SpecificationsSection from './create-car-form-sections/SpecificationsSection';
import VehicleDetailsSection from './create-car-form-sections/VehicleDetailsSection';

const CreateCarForm = () => {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = useCreateCarMutation();
	const methods = useForm({
		resolver: zodResolver(createCarFormSchema),
		defaultValues: {
			status: 'available',
			category: 'sedan',
			transmission: 'automatic',
			fuelType: 'gasoline',
			seatingCapacity: 5,
			doors: 4,
			kilometrage: 0,
			images: [],
			color: '',
			dailyRate: 0,
			licensePlate: '',
			make: '',
			model: '',
			vin: '',
			year: 2020,
		},
	});

	const createCar = async (data: Parameters<typeof mutateAsync>[0]) => {
		methods.clearErrors('root');
		const [error] = await mutateAsync(data);

		if (error) {
			methods.setError('root', {
				message: error.message || 'Unable to add this car. Check the details and try again.',
			});
			return;
		}

		navigate('/agency/fleet');
	};

	const {
		formState: { errors, isSubmitting },
	} = methods;

	return (
		<FormProvider {...methods}>
			<div className="mx-auto w-full max-w-4xl">
				<div className="mb-10 max-w-2xl">
					<Typography variant="h3" className="tracking-tight">
						Add a car to your fleet
					</Typography>
					<Typography variant="body">
						Set the essentials once. We’ll use them to present this vehicle clearly across your
						fleet.
					</Typography>
				</div>

				<form
					className="flex flex-col gap-12"
					onSubmit={methods.handleSubmit(createCar)}
					aria-busy={isSubmitting || isPending}
				>
					<VehicleDetailsSection />
					<section>
						<Typography variant="h4" className="mb-5">
							Specifications
						</Typography>
						<SpecificationsSection />
					</section>
					<PricingStatusSection />
					<ImagesSection />
					<IdentifiersSection />
					<div className="flex flex-col items-end gap-3 border-t border-border/60 pt-6">
						<FieldError errors={[errors.root]} />
						<Button type="submit" size="lg" disabled={isSubmitting || isPending}>
							{(isSubmitting || isPending) && <SpinnerIcon className="animate-spin" />}
							{isSubmitting || isPending ? 'Adding car...' : 'Add car to fleet'}
						</Button>
					</div>
				</form>
			</div>
		</FormProvider>
	);
};

export default CreateCarForm;
