import { createReservationSchema } from '@drivn/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingOfficeIcon, MapPinIcon, SpinnerIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Controller, useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { CreateReservationDto, Location as AgencyLocation, Car } from '@drivn/shared';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { useCreateReservationMutation } from '../hooks';
import { DatePicker } from '@/components/date-picker';

type Props = {
	locations: AgencyLocation[];
	cars: Car[];
};

function ReservationFields({ locations, cars }: Props) {
	const {
		register,
		control,
		setValue,
		formState: { errors },
	} = useFormContext<CreateReservationDto>();
	const carId = useWatch({ control, name: 'carId' });
	const startDate = useWatch({ control, name: 'startDate' });
	const endDate = useWatch({ control, name: 'endDate' });
	const selectedCar = cars.find((car) => car._id === carId);
	const pickupLocationId = useWatch({ control, name: 'pickupLocationId' });
	const dropoffLocationId = useWatch({ control, name: 'dropoffLocationId' });
	const pickupLocation = locations.find((location) => location._id === pickupLocationId);
	const dropoffLocation = locations.find((location) => location._id === dropoffLocationId);

	useEffect(() => {
		setValue('dailyRate', selectedCar?.dailyRate ?? 0, {
			shouldValidate: true,
		});
		if (!startDate || !endDate) {
			setValue('totalDays', 0, { shouldValidate: true });
			setValue('totalAmount', 0, { shouldValidate: true });
			return;
		}

		const duration = Math.ceil(
			(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
		);
		setValue('totalDays', duration, { shouldValidate: true });
		setValue('totalAmount', duration > 0 ? duration * (selectedCar?.dailyRate ?? 0) : 0, {
			shouldValidate: true,
		});
	}, [endDate, selectedCar?.dailyRate, setValue, startDate]);

	return (
		<>
			<FieldSet>
				<Typography variant="h4">Reservation details</Typography>
				<div className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="carId">Car</FieldLabel>
						<Controller
							control={control}
							name="carId"
							render={({ field }) => (
								<Select value={field.value ?? null} onValueChange={field.onChange}>
									<SelectTrigger id="carId" className="w-full" aria-invalid={!!errors.carId}>
										<SelectValue placeholder={cars.length ? 'Select a car' : 'No cars available'} />
									</SelectTrigger>
									<SelectContent>
										{cars.map((car) => (
											<SelectItem key={car._id} value={car._id}>
												{car.year} {car.make} {car.model} — {car.dailyRate.toFixed(2)}/day
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldError errors={[errors.carId]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="status">Status</FieldLabel>
						<Controller
							control={control}
							name="status"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id="status" className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</Field>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="pickupLocationId">Pickup location</FieldLabel>
						<Controller
							control={control}
							name="pickupLocationId"
							render={({ field }) => (
								<Select value={field.value ?? null} onValueChange={field.onChange}>
									<SelectTrigger
										id="pickupLocationId"
										className="h-auto min-h-7 w-full"
										aria-invalid={!!errors.pickupLocationId}
									>
										{pickupLocation ? (
											<LocationSummary location={pickupLocation} />
										) : (
											<SelectValue placeholder="Select a pickup location" />
										)}
									</SelectTrigger>
									<SelectContent>
										{locations.map((location) => (
											<SelectItem key={location._id} value={location._id} className="h-auto py-2">
												<LocationOption location={location} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldError errors={[errors.pickupLocationId]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="dropoffLocationId">Drop-off location</FieldLabel>
						<Controller
							control={control}
							name="dropoffLocationId"
							render={({ field }) => (
								<Select value={field.value ?? null} onValueChange={field.onChange}>
									<SelectTrigger
										id="dropoffLocationId"
										className="h-auto min-h-7 w-full"
										aria-invalid={!!errors.dropoffLocationId}
									>
										{dropoffLocation ? (
											<LocationSummary location={dropoffLocation} />
										) : (
											<SelectValue placeholder="Select a drop-off location" />
										)}
									</SelectTrigger>
									<SelectContent>
										{locations.map((location) => (
											<SelectItem key={location._id} value={location._id} className="h-auto py-2">
												<LocationOption location={location} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldError errors={[errors.dropoffLocationId]} />
					</Field>
				</div>
			</FieldSet>

			<FieldSet>
				<Typography variant="h4">Renter</Typography>
				<div className="grid gap-4 md:grid-cols-3">
					<Field>
						<FieldLabel htmlFor="renterName">Name</FieldLabel>
						<Input id="renterName" {...register('renterName')} aria-invalid={!!errors.renterName} />
						<FieldError errors={[errors.renterName]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="renterEmail">Email</FieldLabel>
						<Input
							id="renterEmail"
							type="email"
							{...register('renterEmail', {
								setValueAs: (value) => value || undefined,
							})}
							aria-invalid={!!errors.renterEmail}
						/>
						<FieldError errors={[errors.renterEmail]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="renterPhone">Phone</FieldLabel>
						<Input
							id="renterPhone"
							{...register('renterPhone', {
								setValueAs: (value) => value || undefined,
							})}
							aria-invalid={!!errors.renterPhone}
						/>
						<FieldError errors={[errors.renterPhone]} />
					</Field>
				</div>
			</FieldSet>

			<FieldSet>
				<Typography variant="h4">Dates and pricing</Typography>
				<div className="grid gap-4 md:grid-cols-4">
					<Field>
						<Label htmlFor="startDate">Pickup date</Label>
						<Controller
							name="startDate"
							control={control}
							render={({ field }) => <DatePicker {...field} />}
						/>
						<FieldError errors={[errors.startDate]} />
					</Field>
					<Field>
						<Label htmlFor="endDate">Drop-off date</Label>

						<Controller
							name="endDate"
							control={control}
							render={({ field }) => <DatePicker {...field} />}
						/>

						<FieldError errors={[errors.endDate]} />
					</Field>
					<Field>
						<Label htmlFor="dailyRate">Daily rate</Label>
						<Input
							id="dailyRate"
							type="number"
							readOnly
							aria-readonly="true"
							{...register('dailyRate', { valueAsNumber: true })}
						/>
						<FieldError errors={[errors.dailyRate]} />
					</Field>
					<Field>
						<Label htmlFor="totalAmount">Total amount</Label>
						<Input
							id="totalAmount"
							type="number"
							readOnly
							aria-readonly="true"
							{...register('totalAmount', { valueAsNumber: true })}
						/>
						<FieldError errors={[errors.totalAmount]} />
					</Field>
				</div>
				<input type="hidden" {...register('totalDays', { valueAsNumber: true })} />
				<FieldError errors={[errors.totalDays]} />
			</FieldSet>

			<Field>
				<FieldLabel htmlFor="notes">Notes</FieldLabel>
				<Textarea
					id="notes"
					{...register('notes', { setValueAs: (value) => value || undefined })}
					aria-invalid={!!errors.notes}
					placeholder="Optional notes about this reservation"
				/>
				<FieldError errors={[errors.notes]} />
			</Field>
		</>
	);
}

function LocationOption({ location }: { location: AgencyLocation }) {
	return (
		<span className="flex min-w-0 items-start gap-2">
			<MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
			<span className="flex min-w-0 flex-col">
				<span className="truncate font-medium">{location.name}</span>
				<span className="truncate text-muted-foreground">
					{location.city}, {location.country}
				</span>
				<span className="truncate text-muted-foreground">{location.address}</span>
			</span>
		</span>
	);
}

function LocationSummary({ location }: { location: AgencyLocation }) {
	return (
		<span className="flex min-w-0 items-center gap-2">
			<BuildingOfficeIcon className="size-4 shrink-0 text-muted-foreground" />
			<span className="flex min-w-0 flex-col text-left">
				<span className="truncate font-medium">{location.name}</span>
				<span className="truncate text-muted-foreground">
					{location.city}, {location.country}
				</span>
			</span>
		</span>
	);
}

function ReservationCreateForm({ locations, cars }: Props) {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = useCreateReservationMutation();
	const form = useForm({
		resolver: zodResolver(createReservationSchema),
		mode: 'onChange',
		defaultValues: {
			status: 'pending',
			renterName: '',
			totalDays: 0,
			dailyRate: 0,
			totalAmount: 0,
		},
	});
	const { errors, isSubmitting } = form.formState;

	const createReservation = async (data: CreateReservationDto) => {
		form.clearErrors('root');
		const [error] = await mutateAsync(data);
		if (error) {
			form.setError('root', {
				message:
					error.message || 'Unable to create this reservation. Check the details and try again.',
			});
			return;
		}
		navigate('/agency/reservations');
	};

	return (
		<FormProvider {...form}>
			<div className="mx-auto w-full max-w-4xl">
				<Typography variant="h3" className="mb-2 tracking-tight">
					Create reservation
				</Typography>
				<Typography variant="body" className="mb-10">
					Add the renter, vehicle, locations, and dates for this booking.
				</Typography>
				<form className="flex flex-col gap-10" onSubmit={form.handleSubmit(createReservation)}>
					<ReservationFields locations={locations} cars={cars} />
					<div className="flex flex-col items-end gap-3 border-t border-border/60 pt-6">
						<FieldError errors={[errors.root]} />
						<Button type="submit" size="lg" disabled={isSubmitting || isPending}>
							{(isSubmitting || isPending) && <SpinnerIcon className="animate-spin" />}
							{isSubmitting || isPending ? 'Creating reservation...' : 'Create reservation'}
						</Button>
					</div>
				</form>
			</div>
		</FormProvider>
	);
}

export default ReservationCreateForm;
