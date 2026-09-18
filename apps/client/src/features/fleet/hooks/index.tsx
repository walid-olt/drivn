import apiClient from '@/lib/api-client';
import queryClient from '@/lib/query-client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

export const useAgencyCars = () => {
	return useSuspenseQuery({
		queryKey: ['cars'],
		queryFn: async () => {
			const [err, cars] = await apiClient.cars.getAgencyCars();
			if (err) throw err;

			return cars.data;
		},
	});
};

export const useCreateCarMutation = () => {
	return useMutation({
		mutationFn: apiClient.cars.create,
		onSuccess: async ([error]) => {
			if (error) return;
			await queryClient.invalidateQueries({ queryKey: ['cars'] });
		},
	});
};

export const useUpdateCarStatusMutation = () => {
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: CarStatus }) =>
			apiClient.cars.update(id, { status }),
		onSuccess: async ([error]) => {
			if (error) return;
			await queryClient.invalidateQueries({ queryKey: ['cars'] });
		},
	});
};

type CarStatus = 'available' | 'rented' | 'maintenance' | 'inactive';
