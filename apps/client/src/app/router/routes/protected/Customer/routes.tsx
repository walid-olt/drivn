import userAuthLoader from '@/app/loaders/userAuthloader';
import Profile from '@/pages/protected/Profile';
import { type RouteObject } from 'react-router';

/**
 * @description
 * These are the protected routes for customers.
 * They will include all routes that are specific to customers,
 * such as profile, reservations, reservation history, etc.
 */
export default [
	{
		path: '/profile',
		element: <Profile />,
		loader: userAuthLoader,
	},
] as RouteObject[];
