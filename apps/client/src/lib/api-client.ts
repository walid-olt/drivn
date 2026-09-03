const API_URL = import.meta.env.VITE_API_URL;
import ky, { isHTTPError } from 'ky';
import { tryCatch, type ApiResult, type Agency } from '@drivn/shared';
const httpClient = ky.create({
	baseUrl: API_URL,
	retry: 3,
	credentials: 'include',
	mode: 'cors',
	prefix: '/api',
	hooks: {
		beforeError: [
			/*
			 * Convert API business logic errors into a normalized client error
			 */
			async ({ error }) => {
				if (isHTTPError(error)) {
					const res = error.data as ApiResult;
					if (!res.success) {
						return new Error(res.message);
					}
				}
				return error;
			},
		],
	},
});

const apiClient = {
	agency: {
		async getActive() {
			const promise = httpClient.get('/agency/onboarding/').json<ApiResult<Agency>>();
			return tryCatch(promise);
		},

		async updateAgencyBranding(data: { summary?: string; logo?: File; banner?: File }) {
			const fd = new FormData();
			Object.entries(data).forEach(([key, val]) => {
				if (val) fd.append(key, val);
			});

			const promise = httpClient.put<ApiResult<Agency>>('/agency/onboarding/branding', {
				body: fd,
			});
			return tryCatch(promise);
		},
	},
};

export default apiClient;
