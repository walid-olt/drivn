import { TypographySkeleton } from '@/components/ui/typography';

const AgencyFormSkeleton = () => {
	return (
		<div className={'flex flex-col gap-4 *:shimmer-color-primary/70 *:shimmer-invert'}>
			<TypographySkeleton variant={'h3'} className="w-4/5">
				Make your agency recognizable
			</TypographySkeleton>
			<TypographySkeleton variant={'body'}>
				Add your logo and a cover image to help customers recognize your agency.
			</TypographySkeleton>
			<TypographySkeleton variant={'body'} className="w-full h-48"></TypographySkeleton>
		</div>
	);
};

export default AgencyFormSkeleton;
