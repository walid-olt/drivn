import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router';

const Register = () => {
	return (
		<section className="mx-auto flex w-full max-w-md flex-col gap-4">
			<Typography variant="h2">Create your account</Typography>
			<Typography variant="body">
				Choose your account type so we can send you to the right space after signup.
			</Typography>
			<Button
				nativeButton={false}
				render={<Link to="/register/customer">Sign up as customer</Link>}
				className="w-full"
			/>
			<Button
				nativeButton={false}
				render={<Link to="/register/agency">Sign up for agency</Link>}
				variant="outline"
				className="w-full"
			/>
			<Typography variant="body">
				Already have an account? <Link to="/login">Log in</Link>
			</Typography>
		</section>
	);
};

export default Register;
