import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { organizationClient } from 'better-auth/client/plugins';
import z from 'zod';

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
				type: {
					type: 'string',
					required: true,
					fieldName: 'type',
					validator: {
						input: z.enum(['customer', 'agency_member']),
						output: z.enum(['customer', 'agency_member']),
					},
				},
			},
		}),
	],
});

export default authClient;
