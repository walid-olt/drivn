import apiClient from '@/lib/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { Reservation } from '@drivn/shared';
import {
	useMutation,
	useQueryClient,
	useSuspenseQueries,
	useSuspenseQuery,
} from '@tanstack/react-query';

export function useCreateReservationMutation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: apiClient.reservations.create,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations });
		},
	});
}

export function useUpdateReservationStatusMutation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: Reservation['status'] }) =>
			apiClient.reservations.updateStatus(id, status),
		onSuccess: async ([error]) => {
			if (error) return;
			await qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations });
			await qc.invalidateQueries({ queryKey: ['cars'] });
		},
	});
}

export function useAgencyReservations() {
	return useSuspenseQuery({
		queryKey: QUERY_KEYS.reservations,
		queryFn: async () => {
			const [err, res] = await apiClient.reservations.getAll();
			if (err) throw err;
			if (!res.success) throw new Error(res.message);
			return res.data;
		},
	});
}

export function useReservationsData() {
	const [{ data: reservations }, { data: cars }, { data: locations }] = useSuspenseQueries({
		queries: [
			{
				queryKey: QUERY_KEYS.reservations,
				queryFn: async () => {
					const [err, res] = await apiClient.reservations.getAll();
					if (err) throw err;
					if (!res.success) throw new Error(res.message);
					return res.data;
				},
			},
			{
				queryKey: ['cars'],
				queryFn: async () => {
					const [err, res] = await apiClient.cars.getAgencyCars();
					if (err) throw err;
					if (!res.success) throw new Error(res.message);
					return res.data;
				},
			},
			{
				queryKey: ['locations'],
				queryFn: async () => {
					const [err, res] = await apiClient.locations.getAll();
					if (err) throw err;
					if (!res.success) throw new Error(res.message);
					return res.data;
				},
			},
		],
	});

	return {
		reservations,
		cars,
		locations,
	};
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
