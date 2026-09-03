import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';

type Props = {
	onSuccess: VoidFunction;
	onSubmit: VoidFunction;
};
const AgencyLocationsForm = ({ onSuccess, onSubmit }: Props) => {
	return (
		<form>
			<Typography variant={'h3'}>Add your rental locations</Typography>
			<Typography variant={'body'}>
				Tell customers where they can pick up and return their vehicles.
			</Typography>
			<Button onClick={onSuccess}>Next</Button>
			<Button onClick={onSubmit}>Submit</Button>
		</form>
	);
};

export default AgencyLocationsForm;
