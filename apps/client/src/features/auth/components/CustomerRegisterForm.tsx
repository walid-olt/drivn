import { SpinnerIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { PhoneInput } from '@/components/PhoneInput';
import { signUpAsCustomer } from '@/lib/api';
import queryClient from '@/lib/query-client';

const customerRegisterSchema = z
	.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		email: z.email(),
		phone: z.string({ error: 'Please enter your phone number.' }).min(6).max(30),
		country: z.string({ error: 'Please select your country.' }).min(2).max(50),
		password: z.string().min(8).max(128),
		passwordConfirmation: z.string().min(8).max(128),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	});

type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;

export default function CustomerRegisterForm() {
	const navigate = useNavigate();
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CustomerRegisterFormData>({
		resolver: zodResolver(customerRegisterSchema),
	});

	async function onSubmit(data: CustomerRegisterFormData) {
		try {
			await signUpAsCustomer({
				name: `${data.firstName} ${data.lastName}`.trim(),
				email: data.email,
				password: data.password,
			});
		} catch (err: any) {
			toast.add({
				type: 'error',
				title: err.message ?? 'Unable to create your account.',
			});
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ['session'] });
		navigate('/profile');
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 text-center">
				<Typography variant="h3">Customer signup</Typography>
				<Typography variant="body">Create your account to start booking cars.</Typography>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor="firstName">First name</FieldLabel>
						<Input
							id="firstName"
							type="text"
							placeholder="Jane"
							autoComplete="given-name"
							aria-invalid={errors.firstName ? true : undefined}
							{...register('firstName')}
						/>
						<FieldError errors={[errors.firstName]} />
					</Field>

					<Field>
						<FieldLabel htmlFor="lastName">Last name</FieldLabel>
						<Input
							id="lastName"
							type="text"
							placeholder="Doe"
							autoComplete="family-name"
							aria-invalid={errors.lastName ? true : undefined}
							{...register('lastName')}
						/>
						<FieldError errors={[errors.lastName]} />
					</Field>
				</div>

				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						autoComplete="email"
						aria-invalid={errors.email ? true : undefined}
						{...register('email')}
					/>
					<FieldError errors={[errors.email]} />
				</Field>

				<Field>
					<FieldLabel>Phone number</FieldLabel>
					<Controller
						control={control}
						name="phone"
						render={({ field }) => (
							<PhoneInput
								name={field.name}
								value={field.value}
								aria-invalid={errors.phone ? true : undefined}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
					<FieldError errors={[errors.phone]} />
				</Field>

				<Field>
					<FieldLabel>Country</FieldLabel>
					<Controller
						control={control}
						name="country"
						render={({ field }) => (
							<CountryDropdown
								value={field.value}
								onChange={(country) => field.onChange(country.name)}
							/>
						)}
					/>
					<FieldError errors={[errors.country]} />
				</Field>

				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						type="password"
						placeholder="At least 8 characters"
						autoComplete="new-password"
						aria-invalid={errors.password ? true : undefined}
						{...register('password')}
					/>
					<FieldError errors={[errors.password]} />
				</Field>

				<Field>
					<FieldLabel htmlFor="passwordConfirmation">Confirm password</FieldLabel>
					<Input
						id="passwordConfirmation"
						type="password"
						placeholder="Repeat your password"
						autoComplete="new-password"
						aria-invalid={errors.passwordConfirmation ? true : undefined}
						{...register('passwordConfirmation')}
					/>
					<FieldError errors={[errors.passwordConfirmation]} />
				</Field>

				<Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
					{isSubmitting && <SpinnerIcon className="animate-spin" />}
					{isSubmitting ? 'Creating account...' : 'Create customer account'}
				</Button>
			</form>

			<Typography variant="caption" className="text-center">
				Registering an agency instead?{' '}
				<Link to="/register/agency" className="font-medium text-primary hover:underline">
					Go to agency signup
				</Link>
			</Typography>
		</div>
	);
}
