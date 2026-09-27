import { createReservationSchema } from '@drivn/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns';
import { useEffect, useRef } from 'react';
import { Controller, useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { CreateReservationDto, Location as AgencyLocation, Car } from '@drivn/shared';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import CarSelector from './CarSelector';
import LocationSelector from './LocationSelector';

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
	const totalDays =
		startDate && endDate ? Math.max(differenceInCalendarDays(endDate, startDate), 0) : 0;

	const startDateRef = useRef<HTMLButtonElement>(null);
	const endDateRef = useRef<HTMLButtonElement>(null);

	// Keeping the drop-off strictly after the pickup is a schema requirement, so
	// nudge it forward instead of leaving the form in an invalid state.
	useEffect(() => {
		if (!startDate) return;
		if (endDate && endDate.getTime() > startDate.getTime()) return;
		setValue('endDate', addDays(startOfDay(startDate), 1), { shouldValidate: true });
	}, [endDate, setValue, startDate]);

	useEffect(() => {
		setValue('dailyRate', selectedCar?.dailyRate ?? 0, {
			shouldValidate: true,
		});

		if (!startDate || !endDate) {
			setValue('totalDays', 0, { shouldValidate: true });
			setValue('totalAmount', 0, { shouldValidate: true });
			return;
		}

		// Calendar days, not milliseconds: a DST boundary would otherwise make a
		// one-day rental look like two (or zero).
		const duration = differenceInCalendarDays(endDate, startDate);
		setValue('totalDays', Math.max(duration, 0), { shouldValidate: true });
		setValue('totalAmount', duration > 0 ? duration * (selectedCar?.dailyRate ?? 0) : 0, {
			shouldValidate: true,
		});
	}, [endDate, selectedCar?.dailyRate, setValue, startDate]);

	return (
		<>
			<FieldSet>
				<Typography variant="h4">Reservation details</Typography>
				<Field>
					<FieldLabel>Car</FieldLabel>
					<Controller
						control={control}
						name="carId"
						render={({ field }) => (
							<CarSelector
								cars={cars}
								value={field.value}
								onChange={field.onChange}
								invalid={!!errors.carId}
							/>
						)}
					/>
					<FieldError errors={[errors.carId]} />
				</Field>
				<Field className="max-w-xs">
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
			</FieldSet>

			<FieldSet>
				<Typography variant="h4">Locations</Typography>
				<div className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="pickupLocationId">Pickup location</FieldLabel>
						<Controller
							control={control}
							name="pickupLocationId"
							render={({ field }) => (
								<LocationSelector
									id="pickupLocationId"
									locations={locations}
									value={field.value}
									onChange={field.onChange}
									placeholder="Search pickup location"
									invalid={!!errors.pickupLocationId}
								/>
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
								<LocationSelector
									id="dropoffLocationId"
									locations={locations}
									value={field.value}
									onChange={field.onChange}
									placeholder="Search drop-off location"
									invalid={!!errors.dropoffLocationId}
								/>
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
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<Field>
						<FieldLabel htmlFor="startDate">Pickup date</FieldLabel>
						<Controller
							name="startDate"
							control={control}
							render={({ field }) => (
								<DatePicker
									id="startDate"
									value={field.value}
									onChange={field.onChange}
									triggerRef={startDateRef}
									minDate={startOfDay(new Date())}
									aria-invalid={!!errors.startDate}
								/>
							)}
						/>
						<FieldError errors={[errors.startDate]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="endDate">Drop-off date</FieldLabel>
						<Controller
							name="endDate"
							control={control}
							render={({ field }) => (
								<DatePicker
									id="endDate"
									value={field.value}
									onChange={field.onChange}
									triggerRef={endDateRef}
									minDate={startDate ? addDays(startOfDay(startDate), 1) : undefined}
									aria-invalid={!!errors.endDate}
								/>
							)}
						/>
						<FieldError errors={[errors.endDate]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="dailyRate">Daily rate</FieldLabel>
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
						<FieldLabel htmlFor="totalAmount">Total amount</FieldLabel>
						<Input
							id="totalAmount"
							type="number"
							readOnly
							aria-readonly="true"
							{...register('totalAmount', { valueAsNumber: true })}
						/>
						<FieldDescription>
							{startDate && endDate
								? `${totalDays} day${totalDays === 1 ? '' : 's'} × ${selectedCar?.dailyRate ?? 0}/day`
								: 'Pick both dates to price this reservation.'}
						</FieldDescription>
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
