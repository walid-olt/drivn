import { useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import type { CarCreateFormData } from '@drivn/shared';

export default function VehicleDetailsSection() {
	const {
		register,
		formState: { errors },
	} = useFormContext<CarCreateFormData>();

	return (
		<section>
			<div className="mb-5 flex items-end justify-between gap-4">
				<Typography variant="h4">Vehicle details</Typography>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="make">Make</FieldLabel>
					<Input
						id="make"
						type="text"
						placeholder="BMW"
						aria-invalid={!!errors.make}
						{...register('make')}
					/>
					<FieldError errors={[errors.make]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="model">Model</FieldLabel>
					<Input
						id="model"
						type="text"
						placeholder="3 Series"
						aria-invalid={errors.model ? true : undefined}
						{...register('model')}
					/>
					<FieldError errors={[errors.model]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="year">Year</FieldLabel>
					<Input
						id="year"
						type="number"
						placeholder="2024"
						aria-invalid={errors.year ? true : undefined}
						{...register('year', { valueAsNumber: true })}
					/>
					<FieldError errors={[errors.year]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="color">Color</FieldLabel>
					<Input
						id="color"
						type="text"
						placeholder="Black"
						aria-invalid={errors.color ? true : undefined}
						{...register('color')}
					/>
					<FieldError errors={[errors.color]} />
				</Field>
			</div>
		</section>
	);
}
