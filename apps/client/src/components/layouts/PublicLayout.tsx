import { Outlet } from 'react-router';
import Footer from '../Footer';
import Navbar from '../Navbar';

const PublicLayout = () => {
	return (
		<div className="flex min-h-dvh flex-col">
			<main className="flex-1 px-4 sm:px-8 lg:px-12">
				<Navbar />
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default PublicLayout;
