import Home from '@/pages/public/Home';
import Unauthorized from '@/pages/public/Unauthorized';
import { type RouteObject } from 'react-router';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import RegisterAgency from '@/pages/public/RegisterAgency';
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
