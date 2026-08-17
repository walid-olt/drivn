import { createBrowserRouter } from 'react-router';
import publicRoutes from './routes/public/routes';
import protectedRoutes from './routes/protected/routes';
import Error from '@/pages/public/Error';
import NotFound from '@/pages/public/NotFound';

const router = createBrowserRouter([
	{
		errorElement: <Error />,
		children: [...publicRoutes, ...protectedRoutes, { path: '*', element: <NotFound /> }],
	},
]);

export default router;
