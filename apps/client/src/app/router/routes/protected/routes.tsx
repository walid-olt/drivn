import { type RouteObject } from 'react-router';
import agencyRoute from './Agency/routes';
import customerRoute from './Customer/routes';
import NoAgency from '@/pages/protected/NoAgency';
import CreateAgency from '@/pages/protected/CreateAgency';
import AcceptInvitation from '@/pages/protected/AcceptInvitation';
import sessionAuthLoader from '@/app/loaders/sessionAuthLoader';
/**
 * @description
 * These are the protected routes for the application.
 * They will combine both customer and agency routes, which will
 * be protected by authentication and authorization.
 */
export default [
	{
		loader: sessionAuthLoader,
		children: [
			...agencyRoute,
			...customerRoute,
			{
				path: '/no-agency',
				element: <NoAgency />,
			},
			{
				path: '/agency/new',
				element: <CreateAgency />,
			},
			{
				path: '/accept-invitation/:invitationId',
				element: <AcceptInvitation />,
			},
		],
	},
] as RouteObject[];
