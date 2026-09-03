import { Typography } from '@/components/ui/typography';
import { Button } from '@ui/button';

type Props = {
	onSuccess: VoidFunction;

	onSubmit: VoidFunction;
};

const AgencySupportForm = ({ onSuccess, onSubmit }: Props) => {
	return (
		<div>
			<Typography variant={'h3'}>How can customers reach you?</Typography>
			<Typography variant={'body'}>
				Add the contact details customers can use when they need help with a booking or have a
				question.
			</Typography>
			<Button onClick={onSuccess}>Next</Button>

			<Button onClick={onSubmit}>Submit</Button>
		</div>
	);
};

export default AgencySupportForm;
