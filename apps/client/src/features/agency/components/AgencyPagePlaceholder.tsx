import { Typography } from '@/components/ui/typography';

type Props = {
	title: string;
};

const AgencyPagePlaceholder = ({ title }: Props) => {
	return (
		<div className="flex flex-1 flex-col gap-2">
			<Typography variant="h1">{title}</Typography>
			<Typography>Coming soon.</Typography>
		</div>
	);
};

export default AgencyPagePlaceholder;
