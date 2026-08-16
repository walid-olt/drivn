import { type RouteObject } from 'react-router';
import agencyRoute from './Agency/routes';
import customerRoute from './Customer/routes';
/**
 * @description
 * These are the protected routes for the application.
 * They will combine both customer and agency routes, which will
 * be protected by authentication and authorization.
 */
export default [
	//TODO: add authentication and authorization logic here to protect the routes
	...agencyRoute,
	...customerRoute,
] as RouteObject[];
