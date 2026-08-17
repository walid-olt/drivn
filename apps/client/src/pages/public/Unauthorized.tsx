import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Lock } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

const Unauthorized = () => {
	const navigate = useNavigate();

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Lock className="size-8 text-muted-foreground" />
			<Typography variant="h3">Access denied</Typography>
			<Typography variant="body">You don't have permission to access this page.</Typography>
			<Button variant="outline" onClick={() => navigate('/login')}>
				Sign in
			</Button>
		</div>
	);
};

export default Unauthorized;
