import apiClient from '@/lib/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';

export function useCreateReservationMutation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: apiClient.reservations.create,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations });
		},
	});
}

export function useReservationCreateData() {
	const [{ data: cars }, { data: locations }, { data: agency }] = useSuspenseQueries({
		queries: [
			{
				queryKey: ['cars'],
				queryFn: async () => {
					const [error, response] = await apiClient.cars.getAgencyCars();
					if (error) throw error;
					if (!response.success) throw new Error(response.message);
					return response.data;
				},
			},
			{
				queryKey: ['locations'],
				queryFn: async () => {
					const [error, response] = await apiClient.locations.getAll();
					if (error) throw error;
					if (!response.success) throw new Error(response.message);
					return response.data;
				},
			},
			{
				queryKey: ['agency'],
				queryFn: async () => {
					const [error, response] = await apiClient.agency.getActive();
					if (error) throw error;
					if (!response.success) throw new Error(response.message);
					return response.data;
				},
			},
		],
	});

	const operatingLocationIds = new Set(agency.operatingLocationIds);

	return {
		cars,
		locations: locations.filter((location) => operatingLocationIds.has(location._id)),
	};
}
