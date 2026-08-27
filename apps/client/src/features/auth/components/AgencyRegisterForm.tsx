import { SpinnerIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { signUpAsAgency } from '@/lib/api';
import queryClient from '@/lib/query-client';

const agencyRegisterSchema = z
	.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		email: z.email(),
		password: z.string().min(8).max(128),
		passwordConfirmation: z.string().min(8).max(128),
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

	async function onSubmit(data: AgencyRegisterFormData) {
		try {
			await signUpAsAgency({
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
		navigate('/no-agency');
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 text-center">
				<Typography variant="h3">Agency signup</Typography>
				<Typography variant="body">Create your account with email and password.</Typography>
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
