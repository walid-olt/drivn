import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useSuspenseQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useState, type SubmitEventHandler } from 'react';
import AgencyLocationsFilters from './AgencyLocationsFilters';
import AgencyLocationsTable from './AgencyLocationsTable';
import { useAgencyLocationsStore } from '../stores/agency-locations.store';

type Props = {
	onSuccess: VoidFunction;
	onSubmit: VoidFunction;
};

const fetchAllLocations = async () => {
	const [error, response] = await apiClient.locations.getAll();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);

	return response.data;
};

const AgencyLocationsForm = ({ onSuccess, onSubmit: startSubmit }: Props) => {
	const { error, data: agencyLocations = [] } = useSuspenseQuery({
		queryKey: ['locations'],
		queryFn: fetchAllLocations,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string>();
	const selectedIds = useAgencyLocationsStore((state) => state.selectedIds);
	if (error) {
		return <p>error : {error.message}</p>;
	}
	const handleSubmit: SubmitEventHandler = async (event) => {
		event.preventDefault();
		setSubmitError(undefined);
		startSubmit();
		setIsSubmitting(true);

		const [requestError] = await apiClient.agency.updateAgencyLocations({
			operatingLocationIds: [...selectedIds],
		});
		if (requestError) {
			setSubmitError(requestError.message);
			setIsSubmitting(false);
			return;
		}

		onSuccess();
	};

	return (
		<form className="flex flex-col gap-6 py-10" onSubmit={handleSubmit}>
			<Typography variant={'h3'}>
				Add your rental locations | available {agencyLocations.length.toLocaleString()} locations
			</Typography>
			<Typography variant={'body'}>
				Tell customers where they can pick up and return their vehicles.
			</Typography>

			<div className="flex gap-2 ">
				<AgencyLocationsFilters />
				<Button
					className={'h-9 '}
					type="submit"
					size="lg"
					disabled={selectedIds.size === 0 || isSubmitting}
				>
					{isSubmitting ? <SpinnerIcon className="animate-spin" /> : null}
					{isSubmitting ? 'Saving' : 'Save and finish setup'}
				</Button>
			</div>
			<AgencyLocationsTable locations={agencyLocations} />
			<div className="flex items-center justify-between gap-4">
				<div>
					<Typography variant="caption">
						{selectedIds.size} location{selectedIds.size === 1 ? '' : 's'} selected
					</Typography>
					{submitError && (
						<Typography variant="caption" className="block text-destructive">
							{submitError}
						</Typography>
					)}
				</div>
			</div>
		</form>
	);
};

export default AgencyLocationsForm;
