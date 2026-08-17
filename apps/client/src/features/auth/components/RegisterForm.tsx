import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import z from 'zod';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

const RegisterSchema = z
	.object({
		name: z.string().min(4).max(128),
		email: z.email(),
		password: z.string().min(8).max(128),
		passwordConfirmation: z.string().min(8).max(128),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterSchema),
	});

	async function onSubmit(data: RegisterFormData) {
		const { error } = await authClient.signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
		});

		if (!error) {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			navigate('/profile');
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant={'h2'}>Create Account</Typography>
			<Typography variant={'h3'}>Please enter your details.</Typography>
			<Input type="text" placeholder="Name" {...register('name')} />
			{errors.name && <span>{errors.name.message}</span>}
			<Input type="email" placeholder="Email" {...register('email')} />
			{errors.email && <span>{errors.email.message}</span>}
			<Input type="password" placeholder="Password" {...register('password')} />
			{errors.password && <span>{errors.password.message}</span>}
			<Input type="password" placeholder="Confirm Password" {...register('passwordConfirmation')} />
			{errors.passwordConfirmation && <span>{errors.passwordConfirmation.message}</span>}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon /> : 'Register'}
			</Button>
		</form>
	);
}
