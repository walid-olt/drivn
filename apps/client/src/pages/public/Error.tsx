import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Warning } from '@phosphor-icons/react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';

const Error = () => {
	const error = useRouteError();
	const navigate = useNavigate();

	const message = isRouteErrorResponse(error)
		? `${error.status} ${error.statusText}`
		: 'Something went wrong';

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Warning className="size-8 text-destructive" weight="fill" />
			<Typography variant="h3">{message}</Typography>
			<Typography variant="body">An unexpected error occurred. Please try again.</Typography>
			<Button variant="outline" onClick={() => navigate('/')}>
				Back to home
			</Button>
		</div>
	);
};

export default Error;
