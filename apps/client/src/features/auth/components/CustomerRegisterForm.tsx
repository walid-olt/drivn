import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import { signUpAsCustomer } from '@/lib/api';
import queryClient from '@/lib/query-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { PhoneInput } from '@/components/PhoneInput';

const customerRegisterSchema = z
	.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		email: z.email(),
		phone: z.string().min(6).max(30),
		country: z.string().min(2).max(50),
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
		<form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-md flex-col gap-3">
			<Typography variant="h2">Customer signup</Typography>
			<Typography variant="h3">Create your account to start booking cars.</Typography>

			<Input type="text" placeholder="First name" {...register('firstName')} />
			{errors.firstName && <span>{errors.firstName.message}</span>}

			<Input type="text" placeholder="Last name" {...register('lastName')} />
			{errors.lastName && <span>{errors.lastName.message}</span>}

			<Input type="email" placeholder="Email" {...register('email')} />
			{errors.email && <span>{errors.email.message}</span>}
			{/*TODO:  Make this phone input match stype of project  and hook it to state */}

			<PhoneInput />
			{errors.phone && <span>{errors.phone.message}</span>}

			<Input type="text" placeholder="Country" {...register('country')} />
			{errors.country && <span>{errors.country.message}</span>}

			<Input type="password" placeholder="Password" {...register('password')} />
			{errors.password && <span>{errors.password.message}</span>}

			<Input type="password" placeholder="Confirm Password" {...register('passwordConfirmation')} />
			{errors.passwordConfirmation && <span>{errors.passwordConfirmation.message}</span>}

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon /> : 'Create customer account'}
			</Button>

			<Typography variant="body">
				Registering an agency instead? <Link to="/register/agency">Go to agency signup</Link>
			</Typography>
		</form>
	);
}
