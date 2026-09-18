import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@/components/ui/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';

export default function PricingStatusSection() {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<section>
			<div className="mb-5">
				<Typography variant="h4">Pricing & status</Typography>
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				<Field>
					<FieldLabel htmlFor="status">Availability</FieldLabel>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger
									id="status"
									className="w-full"
									aria-invalid={errors.status ? true : undefined}
								>
									<SelectValue placeholder="Select availability" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="available">Available</SelectItem>
									<SelectItem value="rented">Rented</SelectItem>
									<SelectItem value="maintenance">Maintenance</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError errors={[errors.status]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="dailyRate">Daily rate</FieldLabel>
					<InputGroup>
						<InputGroupAddon align="inline-start">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							id="dailyRate"
							type="number"
							min={1}
							step="0.01"
							placeholder="79"
							aria-invalid={errors.dailyRate ? true : undefined}
							{...register('dailyRate', { valueAsNumber: true })}
						/>
					</InputGroup>
					<FieldError errors={[errors.dailyRate]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="kilometrage">Kilometrage</FieldLabel>
					<Input id="kilometrage" type="number" min={0} step="1" aria-invalid={errors.kilometrage ? true : undefined} {...register('kilometrage', { valueAsNumber: true })} />
					<FieldError errors={[errors.kilometrage]} />
				</Field>
			</div>
		</section>
	);
}
