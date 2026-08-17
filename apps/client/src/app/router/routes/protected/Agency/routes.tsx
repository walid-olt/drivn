import organizationAuthLoader from '@/app/loaders/organizationAuthLoader';
import Agency from '@/pages/protected/Agency';
import { type RouteObject } from 'react-router';

/**
 * @description
 * These are the protected routes for agencies.
 * They will include all routes that are specific to agencies,
 * such as agency dashboard, agency profile, etc.
 */
export default [
	{
		loader: organizationAuthLoader,
		children: [
			{
				path: '/agency',
				element: <Agency />,
			},
		],
	},
] as RouteObject[];
