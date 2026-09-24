import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import type { Agency, Location as AgencyLocation } from '@drivn/shared';
import apiClient from '@/lib/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';

const fetchActiveAgency = async () => {
	const [error, response] = await apiClient.agency.getActive();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};

export function useAgencyLocationManagement() {
	const [{ data: locations }, { data: agency }] = useSuspenseQueries({
		queries: [
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
				queryKey: QUERY_KEYS.agency,
				queryFn: fetchActiveAgency,
			},
		],
	});

	return {
		locations,
		selectedIds: useMemo(() => new Set(agency.operatingLocationIds), [agency.operatingLocationIds]),
	};
}

export function useActiveLocationCount() {
	const { data: agency } = useQuery({
		queryKey: QUERY_KEYS.agency,
		queryFn: fetchActiveAgency,
	});

	return agency?.operatingLocationIds.length ?? 0;
}

export function useUpdateAgencyLocations() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (operatingLocationIds: string[]) =>
			apiClient.agency.updateOperatingLocations({ operatingLocationIds }),
		onMutate: async (operatingLocationIds) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.agency });
			const previousAgency = queryClient.getQueryData<Agency>(QUERY_KEYS.agency);
			queryClient.setQueryData<Agency>(QUERY_KEYS.agency, (current) =>
				current ? { ...current, operatingLocationIds } : current,
			);
			return { previousAgency };
		},
		onError: (_error, _operatingLocationIds, context) => {
			if (context?.previousAgency) {
				queryClient.setQueryData<Agency>(QUERY_KEYS.agency, context.previousAgency);
			}
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency }),
	});
}

export type LocationType = AgencyLocation['type'] | 'all';
