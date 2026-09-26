import apiClient from '@/lib/api-client';
import type { Agency } from '@drivn/shared';

export const fetchActiveAgency = async (): Promise<Agency> => {
	const [error, response] = await apiClient.agency.getActive();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};
