import { type RouteObject } from 'react-router';

/**
 * @description
 * These are the public routes for the application.
 * They will include the home page, car listings , login, register, and other public pages.
 */
export default [
	{
		path: '/',
		index: true,
		lazy: () => import('@/components/Placeholder'),
	},
] as RouteObject[];
