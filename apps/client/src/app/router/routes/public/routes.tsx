import Home from '@/pages/public/Home';
import Unauthorized from '@/pages/public/Unauthorized';
import VerifyEmail from '@/pages/public/VerifyEmail';
import { type RouteObject } from 'react-router';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import RegisterAgency from '@/pages/public/RegisterAgency';
import AcceptInvitation from '@/features/agency/pages/AcceptInvitation';
import { redirectIfAuthenticated } from '../../middleware/redirectIfAuthenticated';
import PublicLayout from '@/components/layouts/PublicLayout';

/**
 * @description
 * These are the public authentication and landing routes.
 */
export default [
	{
		element: <PublicLayout />,
		children: [
			{
				middleware: [redirectIfAuthenticated],
				children: [
					{
						path: '/',
						index: true,
						element: <Home />,
					},
					{
						path: '/unauthorized',
						element: <Unauthorized />,
					},
				],
			},
			{
				path: '/verify-email',
				element: <VerifyEmail />,
			},
			{
				path: '/accept-invitation/:invitationId',
				element: <AcceptInvitation />,
			},
		],
	},
	{
		middleware: [redirectIfAuthenticated],
		children: [
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/register/agency',
				element: <RegisterAgency />,
			},
		],
	},
] as RouteObject[];
