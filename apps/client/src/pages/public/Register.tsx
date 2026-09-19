import { BuildingsIcon } from '@phosphor-icons/react';
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
						Create an account to manage your agency workspace.
					</Typography>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						nativeButton={false}
						render={<Link to="/register/agency" />}
						size="lg"
						className="w-full"
					>
						<BuildingsIcon data-icon="inline-start" />
						Create agency account
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
