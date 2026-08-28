import Home from '@/pages/public/Home';
import Unauthorized from '@/pages/public/Unauthorized';
import VerifyEmail from '@/pages/public/VerifyEmail';
import { type RouteObject } from 'react-router';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import RegisterAgency from '@/pages/public/RegisterAgency';
import RegisterCustomer from '@/pages/public/RegisterCustomer';
import { redirectIfAuthenticated } from '../../middleware/redirectIfAuthenticated';
import PublicLayout from '@/components/layouts/PublicLayout';

/**
 * @description
 * These are the public routes for the application.
 * They will include the home page, car listings , login, register, and other public pages.
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
						path: '/cars',
						lazy: () => import('@/pages/public/Cars'),
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
				path: '/register/customer',
				element: <RegisterCustomer />,
			},
			{
				path: '/register/agency',
				element: <RegisterAgency />,
			},
		],
	},
] as RouteObject[];
