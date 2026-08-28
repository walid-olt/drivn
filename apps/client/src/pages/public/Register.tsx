import { BuildingsIcon, UserIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const Register = () => {
	return (
		<AuthLayout>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1 text-center">
					<Typography variant="h3">Create your account</Typography>
					<Typography variant="body">
						Choose your account type so we can send you to the right space after signup.
					</Typography>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						nativeButton={false}
						render={<Link to="/register/customer" />}
						size="lg"
						className="w-full"
					>
						<UserIcon data-icon="inline-start" />
						Sign up as customer
					</Button>
					<Button
						nativeButton={false}
						render={<Link to="/register/agency" />}
						size="lg"
						variant="outline"
						className="w-full"
					>
						<BuildingsIcon data-icon="inline-start" />
						Sign up for agency
					</Button>
				</div>

				<Typography variant="caption" className="text-center">
					Already have an account?{' '}
					<Link to="/login" className="font-medium text-primary hover:underline">
						Log in
					</Link>
				</Typography>
			</div>
		</AuthLayout>
	);
};

export default Register;
