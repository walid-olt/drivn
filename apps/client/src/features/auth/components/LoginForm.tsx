import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { z } from 'zod';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(20),
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

		if (!error) {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			navigate('/profile');
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant={'h2'}>Welcom Back</Typography>
			<Typography variant={'h3'}>Please enter your details.</Typography>
			<Input type="email" placeholder="Email" {...register('email')} />
			{errors.email && <span>{errors.email.message}</span>}
			<Input type="password" placeholder="Password" {...register('password')} />
			{errors.password && <span>{errors.password.message}</span>}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon /> : 'Login'}
			</Button>
		</form>
	);
}
