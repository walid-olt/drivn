import apiClient from '@/lib/api-client';
import queryClient from '@/lib/query-client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

export const useAgencyCars = () => {
	return useSuspenseQuery({
		queryKey: ['agency', 'cars'],
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
			await queryClient.invalidateQueries({ queryKey: ['agency', 'cars'] });
		},
	});
};
