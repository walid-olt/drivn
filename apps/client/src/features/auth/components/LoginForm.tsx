import { AtIcon, LockKeyIcon, SpinnerIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(128),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const redirectTo = params.get('redirectTo');
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	async function onSubmit(data: LoginFormData) {
		const { error, data: session } = await authClient.signIn.email({
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
		const user = session.user;

		await queryClient.invalidateQueries({ queryKey: ['session'] });
		if (redirectTo) return navigate(redirectTo);
		navigate((user as any).type === 'customer' ? '/profile' : '/agency');
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 text-center">
				<Typography variant="h3">Welcome back</Typography>
				<Typography variant="body">Please enter your details to sign in.</Typography>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<InputGroup>
						<InputGroupAddon align="inline-start">
							<AtIcon />
						</InputGroupAddon>
						<InputGroupInput
							id="email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							aria-invalid={errors.email ? true : undefined}
							{...register('email')}
						/>
					</InputGroup>
					<FieldError errors={[errors.email]} />
				</Field>

				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<InputGroup>
						<InputGroupAddon align="inline-start">
							<LockKeyIcon />
						</InputGroupAddon>
						<InputGroupInput
							id="password"
							type="password"
							placeholder="••••••••"
							autoComplete="current-password"
							aria-invalid={errors.password ? true : undefined}
							{...register('password')}
						/>
					</InputGroup>
					<FieldError errors={[errors.password]} />
				</Field>

				<Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
					{isSubmitting && <SpinnerIcon className="animate-spin" />}
					{isSubmitting ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>

			<Typography variant="caption" className="text-center">
				Need an account?{' '}
				<Link to="/register" className="font-medium text-primary hover:underline">
					Choose signup type
				</Link>
			</Typography>
		</div>
	);
}
