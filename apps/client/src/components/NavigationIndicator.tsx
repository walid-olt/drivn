import { useNavigation } from 'react-router';
import { BarLoader } from 'react-spinners';

const NavigationIndicator = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state !== 'idle';

	return (
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
	);
};

export default NavigationIndicator;
