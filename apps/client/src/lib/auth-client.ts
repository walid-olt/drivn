import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { organizationClient } from 'better-auth/client/plugins';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
	throw new Error('authClient requires an API url.');
}

const authClient = createAuthClient({
	baseURL: API_URL,
	plugins: [
		organizationClient(),
		inferAdditionalFields({
			user: {
				role: {
					type: 'string',
				},
			},
		}),
	],
});

export default authClient;
