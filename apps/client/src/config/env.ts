export const env = {
	apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
	frontendUrl: import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173',
} as const;
