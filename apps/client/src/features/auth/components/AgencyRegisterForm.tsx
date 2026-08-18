import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const agencyRegisterSchema = z
	.object({
		email: z.email(),
		password: z.string().min(8).max(128),
		passwordConfirmation: z.string().min(8).max(128),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	});

type AgencyRegisterFormData = z.infer<typeof agencyRegisterSchema>;

function getNameFromEmail(email: string) {
	const fallback = 'Agency user';
	const value = email.split('@')[0]?.trim();

	if (!value) return fallback;
	return value;
}

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
		const { error } = await authClient.signUp.email({
			name: getNameFromEmail(data.email),
			email: data.email,
			password: data.password,
		});

		if (error) {
			toast.add({
				type: 'error',
				title: error.message ?? 'Unable to create your account.',
			});
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ['session'] });
		navigate('/no-agency');
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-md flex-col gap-3">
			<Typography variant="h2">Agency signup</Typography>
			<Typography variant="h3">Create your account with email and password.</Typography>

			<Input type="email" placeholder="Email" {...register('email')} />
			{errors.email && <span>{errors.email.message}</span>}

			<Input type="password" placeholder="Password" {...register('password')} />
			{errors.password && <span>{errors.password.message}</span>}

			<Input type="password" placeholder="Confirm Password" {...register('passwordConfirmation')} />
			{errors.passwordConfirmation && <span>{errors.passwordConfirmation.message}</span>}

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon /> : 'Create agency account'}
			</Button>

			<Typography variant="body">
				Signing up as a customer instead? <Link to="/register/customer">Go to customer signup</Link>
			</Typography>
		</form>
	);
}
