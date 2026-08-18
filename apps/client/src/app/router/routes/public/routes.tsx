import Home from '@/pages/public/Home';
import Cars from '@/pages/public/Cars';
import { type RouteObject } from 'react-router';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import RegisterAgency from '@/pages/public/RegisterAgency';
import RegisterCustomer from '@/pages/public/RegisterCustomer';
import VerifyEmail from '@/pages/public/VerifyEmail';

/**
 * @description
 * These are the public routes for the application.
 * They will include the home page, car listings , login, register, and other public pages.
 */
export default [
	{
		path: '/',
		index: true,
		element: <Home />,
	},
	{
		path: '/cars',
		element: <Cars />,
	},
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
	{
		path: '/verify-email',
		element: <VerifyEmail />,
	},
] as RouteObject[];
