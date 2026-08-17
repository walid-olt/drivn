import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HouseIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
			<Typography variant="h1" className="text-muted-foreground">
				404
			</Typography>
			<Typography variant="body">Page not found</Typography>
			<Button variant="outline" onClick={() => navigate('/')}>
				<HouseIcon data-icon="inline-start" />
				Back to home
			</Button>
		</div>
	);
};

export default NotFound;
