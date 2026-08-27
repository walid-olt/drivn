import { Outlet, ScrollRestoration, useNavigation } from 'react-router';
import { BarLoader } from 'react-spinners';

function Layout() {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	return (
		<>
			<BarLoader
				loading={isLoading}
				width="100%"
				height={3}
				color="var(--primary)"
				cssOverride={{
					top: 0,
					left: 0,
					zIndex: 9999,
				}}
			/>
			<ScrollRestoration />
			<Outlet />
		</>
	);
}

export default Layout;
