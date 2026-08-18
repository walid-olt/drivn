import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import { z } from 'zod';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router';
import { resolveCurrentUserSpace } from '@/lib/auth-space';

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(128),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	async function onSubmit(data: LoginFormData) {
		const { error } = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});

		if (error) {
			toast.add({
				type: 'error',
				title: error.message ?? 'Unable to sign in.',
			});
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ['session'] });
		const { space } = await resolveCurrentUserSpace();
		navigate(space === 'agency' ? '/agency' : '/profile');
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant={'h2'}>Welcome Back</Typography>
			<Typography variant={'h3'}>Please enter your details.</Typography>
			<Input type="email" placeholder="Email" {...register('email')} />
			{errors.email && <span>{errors.email.message}</span>}
			<Input type="password" placeholder="Password" {...register('password')} />
			{errors.password && <span>{errors.password.message}</span>}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon /> : 'Login'}
			</Button>
			<Typography variant="body">
				Need an account? <Link to="/register">Choose signup type</Link>
			</Typography>
		</form>
	);
}
