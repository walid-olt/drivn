import { Typography } from '@/components/ui/typography';
import { Spinner } from '@phosphor-icons/react';

const Loading = () => {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
			<Spinner className="size-6 animate-spin text-muted-foreground" />
			<Typography variant="caption">Loading...</Typography>
		</div>
	);
};

export default Loading;
