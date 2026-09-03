import { cn } from '@/lib/utils';
import { Typography } from './typography';
import { FadeLoader } from 'react-spinners';

type Props = {
	message?: string;
	indicator?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

const Loading = ({ message, indicator, className, ...rest }: Props) => {
	return (
		<div className={cn('h-screen flex flex-col items-center justify-center', className)} {...rest}>
			{indicator ? indicator : <FadeLoader className="size-16" color="var(--primary)" />}
			<Typography className="shimmer" variant={'body'}>
				{message ?? 'Hold on a minute...'}
			</Typography>
		</div>
	);
};

export default Loading;
