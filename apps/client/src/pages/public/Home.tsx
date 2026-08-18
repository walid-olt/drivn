import { Button } from '@/components/ui/button';
import { Typography } from '@ui/typography';
import { Link } from 'react-router';

const Home = () => {
	return (
		<div className="flex flex-col gap-6 p-8">
			<Typography variant="h1">Home</Typography>

			<section className="flex flex-col gap-2">
				<Typography variant="h3">Auth</Typography>
				<div className="flex flex-col gap-1">
					<Button nativeButton={false} render={<Link to="/login">Login</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/register">Register (choose type)</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/register/customer">Register as customer</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/register/agency">Register as agency</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/verify-email">Verify email (needs token)</Link>} variant="outline" />
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<Typography variant="h3">Protected</Typography>
				<div className="flex flex-col gap-1">
					<Button nativeButton={false} render={<Link to="/profile">Profile (customer)</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/agency">Agency dashboard</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/no-agency">No agency (create prompt)</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/agency/new">Create agency</Link>} variant="outline" />
					<Button nativeButton={false} render={<Link to="/accept-invitation/test-id">Accept invitation (test)</Link>} variant="outline" />
				</div>
			</section>
		</div>
	);
};

export default Home;
