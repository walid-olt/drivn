import { type CarCreateFormData } from '@drivn/shared';
import {
	ArrowsLeftRightIcon,
	BatteryChargingIcon,
	CarIcon,
	CarProfileIcon,
	CarSimpleIcon,
	CrownIcon,
	GasPumpIcon,
	GaugeIcon,
	UsersThreeIcon,
} from '@phosphor-icons/react';
import { Controller, useFormContext } from 'react-hook-form';

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const categoryOptions = [
	{
		value: 'sedan',
		label: 'Sedan',
		description: 'Everyday comfort',
		icon: CarIcon,
	},
	{
		value: 'suv',
		label: 'SUV',
		description: 'Roomy and versatile',
		icon: CarIcon,
	},
	{
		value: 'hatchback',
		label: 'Hatchback',
		description: 'Compact and agile',
		icon: CarSimpleIcon,
	},
	{
		value: 'coupe',
		label: 'Coupe',
		description: 'Sporty two-door profile',
		icon: CarSimpleIcon,
	},
	{
		value: 'convertible',
		label: 'Convertible',
		description: 'Open-air driving',
		icon: CarProfileIcon,
	},
	{
		value: 'minivan',
		label: 'Minivan',
		description: 'Flexible passenger space',
		icon: UsersThreeIcon,
	},
	{
		value: 'luxury',
		label: 'Luxury',
		description: 'Premium comfort',
		icon: CrownIcon,
	},
] as const;

const fuelOptions = [
	{
		value: 'gasoline',
		label: 'Gasoline',
		description: 'Traditional fuel',
		icon: GasPumpIcon,
	},
	{
		value: 'diesel',
		label: 'Diesel',
		description: 'Efficiency for long routes',
		icon: GasPumpIcon,
	},
	{
		value: 'electric',
		label: 'Electric',
		description: 'Zero tailpipe emission',
		icon: BatteryChargingIcon,
	},
	{
		value: 'hybrid',
		label: 'Hybrid',
		description: 'Electric + fuel',
		icon: GaugeIcon,
	},
] as const;

const transmissionOptions = [
	{
		value: 'automatic',
		label: 'Automatic',
		description: 'Smooth and easy',
		icon: ArrowsLeftRightIcon,
	},
	{
		value: 'manual',
		label: 'Manual',
		description: 'More control',
		icon: ArrowsLeftRightIcon,
	},
	{
		value: 'semi-automatic',
		label: 'Semi-automatic',
		description: 'Hybrid shifting',
		icon: ArrowsLeftRightIcon,
	},
] as const;

function RadioCardGroup<T extends string>({
	name,
	options,
}: {
	name: 'category' | 'fuelType' | 'transmission';
	options: readonly {
		value: T;
		label: string;
		description: string;
		icon: typeof CarIcon;
	}[];
}) {
	const {
		control,
		formState: { errors },
	} = useFormContext<CarCreateFormData>();

	return (
		<>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<RadioGroup value={field.value} onValueChange={field.onChange} className="max-w-1/2">
						{options.map(({ value, label, description, icon: Icon }) => {
							const checked = field.value === value;
							return (
								<label key={value} htmlFor={value} className="block w-full cursor-pointer">
									<Field
										orientation="horizontal"
										className={cn(
											'w-full rounded-lg border p-3 transition-colors',
											checked
												? 'border-primary bg-primary/5 ring-2 ring-primary/20'
												: 'border-border bg-background hover:border-muted-foreground/40',
										)}
									>
										<FieldContent>
											<div className="flex items-center gap-3">
												<div className="rounded-md border border-current/20 bg-background p-2 text-primary">
													<Icon className="size-4" weight="fill" />
												</div>
												<div>
													<FieldTitle>{label}</FieldTitle>
													<FieldDescription>{description}</FieldDescription>
												</div>
											</div>
										</FieldContent>
										<RadioGroupItem value={value} id={value} />
									</Field>
								</label>
							);
						})}
					</RadioGroup>
				)}
			/>
			{errors[name] && <FieldError errors={[errors[name]]} />}
		</>
	);
}

const SpecificationsSection = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<CarCreateFormData>();

	return (
		<div className="flex flex-col gap-6">
			<FieldSet>
				<FieldLegend>Vehicle type</FieldLegend>
				<RadioCardGroup name="category" options={categoryOptions} />
			</FieldSet>

			<FieldSet>
				<FieldLegend>Fuel type</FieldLegend>
				<RadioCardGroup name="fuelType" options={fuelOptions} />
			</FieldSet>

			<FieldSet>
				<FieldLegend>Transmission</FieldLegend>
				<RadioCardGroup name="transmission" options={transmissionOptions} />
			</FieldSet>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field>
					<label htmlFor="seatingCapacity" className="text-sm font-medium text-foreground">
						Seating capacity
					</label>
					<input
						id="seatingCapacity"
						type="number"
						min={1}
						max={12}
						className="h-9 w-full rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
						aria-invalid={errors.seatingCapacity ? true : undefined}
						{...register('seatingCapacity', { valueAsNumber: true })}
					/>
					<FieldError errors={[errors.seatingCapacity]} />
				</Field>

				<Field>
					<label htmlFor="doors" className="text-sm font-medium text-foreground">
						Doors
					</label>
					<input
						id="doors"
						type="number"
						min={2}
						max={6}
						className="h-9 w-full rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
						aria-invalid={errors.doors ? true : undefined}
						{...register('doors', { valueAsNumber: true })}
					/>
					<FieldError errors={[errors.doors]} />
				</Field>
			</div>
		</div>
	);
};

export default SpecificationsSection;
