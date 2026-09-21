import { useFormContext } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

export default function IdentifiersSection() {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<section>
			<div className="mb-5">
				<Typography variant="h4">Identifiers</Typography>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="vin">VIN</FieldLabel>
					<Input
						id="vin"
						type="text"
						placeholder="1FA6P8CF0H5123456"
						aria-invalid={errors.vin ? true : undefined}
						{...register('vin')}
					/>
					<FieldError errors={[errors.vin]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="licensePlate">License plate</FieldLabel>
					<Input
						id="licensePlate"
						type="text"
						placeholder="ABC-1234"
						aria-invalid={errors.licensePlate ? true : undefined}
						{...register('licensePlate')}
					/>
					<FieldDescription>Optional but useful for in-person tracking.</FieldDescription>
					<FieldError errors={[errors.licensePlate]} />
				</Field>
			</div>
		</section>
	);
}
