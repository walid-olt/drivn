import { Button } from '@ui/button';
import { RocketLaunchIcon } from '@phosphor-icons/react';
const App = () => {
	return (
		<div className={'flex h-screen w-screen items-center justify-center'}>
			<Button className={'font-serif'}>
				{' '}
				let's go <RocketLaunchIcon />
			</Button>
		</div>
	);
};

export default App;
