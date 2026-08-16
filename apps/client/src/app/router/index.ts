import { createBrowserRouter } from 'react-router';
import publicRoutes from './routes/public/routes';
import protectedRoutes from './routes/protected/routes';
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export default router;
