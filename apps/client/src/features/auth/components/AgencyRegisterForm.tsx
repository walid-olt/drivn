import { SpinnerIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { signUpAsAgency } from '@/lib/api';
import queryClient from '@/lib/query-client';
import { AuthFormMessage, getAuthErrorMessage } from './AuthFormMessage';

const agencyRegisterSchema = z
	.object({
		firstName: z
			.string({ error: 'Enter your first name.' })
			.trim()
			.min(2, 'First name must be at least 2 characters.')
			.max(50, 'First name must be 50 characters or fewer.'),
		lastName: z
			.string({ error: 'Enter your last name.' })
			.trim()
			.min(2, 'Last name must be at least 2 characters.')
			.max(50, 'Last name must be 50 characters or fewer.'),
		email: z.email('Enter a valid email address.'),
		password: z
			.string({ error: 'Create a password.' })
			.min(8, 'Password must be at least 8 characters.')
			.max(128, 'Password must be 128 characters or fewer.'),
		passwordConfirmation: z
			.string({ error: 'Confirm your password.' })
			.min(8, 'Password must be at least 8 characters.')
			.max(128, 'Password must be 128 characters or fewer.'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	});

type AgencyRegisterFormData = z.infer<typeof agencyRegisterSchema>;

export default function AgencyRegisterForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AgencyRegisterFormData>({
		resolver: zodResolver(agencyRegisterSchema),
	});
	const [submitError, setSubmitError] = useState<string | null>(null);

	async function onSubmit(data: AgencyRegisterFormData) {
		setSubmitError(null);
		try {
			await signUpAsAgency({
				name: `${data.firstName} ${data.lastName}`.trim(),
				email: data.email,
				password: data.password,
			});
		} catch (err: unknown) {
			setSubmitError(getAuthErrorMessage(err, 'Unable to create your account.'));
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ['session'] });
		navigate('/no-agency');
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 text-center">
				<Typography variant="h3">Agency signup</Typography>
				<Typography variant="body">Create your account with email and password.</Typography>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				aria-busy={isSubmitting}
			>
				<AuthFormMessage message={submitError} />
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
					{isSubmitting ? 'Creating account...' : 'Create agency account'}
				</Button>
			</form>

			<Typography variant="caption" className="text-center">
				Signing up as a customer instead?{' '}
				<Link to="/register/customer" className="font-medium text-primary hover:underline">
					Go to customer signup
				</Link>
			</Typography>
		</div>
	);
}
