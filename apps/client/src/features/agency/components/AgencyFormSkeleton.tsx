import { TypographySkeleton } from '@/components/ui/typography';

const AgencyFormSkeleton = () => {
	return (
		<div className={'flex flex-col gap-4 *:shimmer-color-primary/70 *:shimmer-invert'}>
			<TypographySkeleton variant={'h4'} className="w-4/5">
				Make your agency recognizable
			</TypographySkeleton>
			<TypographySkeleton variant={'body'}>
				Add your logo and a cover image to keep your agency workspace recognizable.
			</TypographySkeleton>
			<TypographySkeleton variant={'body'} className="w-full h-48"></TypographySkeleton>
		</div>
	);
};

export default AgencyFormSkeleton;
