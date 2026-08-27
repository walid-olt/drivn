import { createBrowserRouter } from 'react-router';
import publicRoutes from './routes/public/routes';
import protectedRoutes from './routes/protected/routes';
import Error from '@/pages/public/Error';
import NotFound from '@/pages/public/NotFound';
import GlobalLayout from '@/components/layouts/GlobalLayout';

const router = createBrowserRouter([
	{
		errorElement: <Error />,
		element: <GlobalLayout />,
		children: [...publicRoutes, ...protectedRoutes, { path: '*', element: <NotFound /> }],
	},
]);

export default router;
