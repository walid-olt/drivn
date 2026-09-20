const API_URL = import.meta.env.VITE_API_URL;
import ky, { isHTTPError } from 'ky';
import {
	tryCatch,
	type ApiResult,
	type Agency,
	type UpdateAgencyBrandingDto,
	type UpdateAgencyLocationsDto,
	type UpdateAgencySupportDto,
	type Location as AgencyLocation, // Renamed to avoid naming conflict with the Window Location type
	type Car,
	type UpdateCarDto,
	type ApiResponse,
	type CarCreateFormData,
} from '@drivn/shared';
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

type UpdateCarRequest = Omit<UpdateCarDto, 'images'> & {
	images?: File[] | string[];
};

function appendCarFields(formData: FormData, data: Record<string, unknown>) {
	Object.entries(data).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (value instanceof Blob) {
			formData.append(key, value);
			return;
		}
		if (key === 'images' && Array.isArray(value)) {
			value.forEach((image) => formData.append('images', image as Blob | string));
			return;
		}
		formData.append(key, String(value));
	});
}

const apiClient = {
	agency: {
		async getActive() {
			const promise = httpClient.get('/agency').json<ApiResult<Agency>>();
			return tryCatch(promise);
		},

		async updateAgencyBranding(
			data: Omit<UpdateAgencyBrandingDto, 'logo' | 'banner'> & {
				logo?: File;
				banner?: File;
			},
		) {
			const fd = new FormData();
			appendCarFields(fd, data);
			const promise = httpClient
				.put<ApiResult<Agency>>('/agency/onboarding/branding', { body: fd })
				.json<ApiResult<Agency>>();
			return tryCatch(promise);
		},

		async updateAgencySupport(data: UpdateAgencySupportDto) {
			const promise = httpClient
				.put<ApiResult<Agency>>('/agency/onboarding/support', { json: data })
				.json<ApiResult<Agency>>();
			return tryCatch(promise);
		},

		async updateAgencyLocations(data: UpdateAgencyLocationsDto) {
			const promise = httpClient
				.put<ApiResult<Agency>>('/agency/onboarding/locations', { json: data })
				.json<ApiResult<Agency>>();
			return tryCatch(promise);
		},
	},
	locations: {
		getAll() {
			const promise = httpClient.get('/locations').json<ApiResult<AgencyLocation[]>>();
			return tryCatch(promise);
		},
	},
	cars: {
		async getAgencyCars() {
			const promise = httpClient.get('/cars/agency').json<ApiResponse<Car[]>>();
			return tryCatch(promise);
		},

		async create(data: CarCreateFormData) {
			const formData = new FormData();
			appendCarFields(formData, data);
			const promise = httpClient
				.post('/cars', {
					body: formData,
				})
				.json<ApiResponse<Car>>();
			return tryCatch(promise);
		},

		async update(id: string, data: UpdateCarRequest) {
			const hasFileUploads = data.images?.some((image) => image instanceof File) ?? false;
			const promise = hasFileUploads
				? httpClient
						.patch(`/cars/${id}`, {
							body: (() => {
								const formData = new FormData();
								appendCarFields(formData, data);
								return formData;
							})(),
						})
						.json<ApiResult<Car>>()
				: httpClient.patch(`/cars/${id}`, { json: data }).json<ApiResult<Car>>();
			return tryCatch(promise);
		},

		async delete(id: string) {
			const promise = httpClient.delete(`/cars/${id}`).json<ApiResult<Car>>();
			return tryCatch(promise);
		},
	},
};

export default apiClient;
