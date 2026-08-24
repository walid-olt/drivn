import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import router from './app/router';
import queryClient from './lib/query-client';
import { Toaster } from '@/components/ui/toast';

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<Toaster />
		<RouterProvider router={router} />
	</QueryClientProvider>,
);
