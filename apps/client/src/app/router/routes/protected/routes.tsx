import { type RouteObject } from 'react-router';
import agencyRoute from './Agency/routes';
import customerRoute from './Customer/routes';
import NoAgency from '@/pages/protected/NoAgency';
import userAuthLoader from '@/app/loaders/userAuthloader';
/**
 * @description
 * These are the protected routes for the application.
 * They will combine both customer and agency routes, which will
 * be protected by authentication and authorization.
 */
export default [
	{
		loader: userAuthLoader,
		children: [
			...agencyRoute,
			...customerRoute,
			{
				path: '/no-agency',
				element: <NoAgency />,
			},
		],
	},
] as RouteObject[];
