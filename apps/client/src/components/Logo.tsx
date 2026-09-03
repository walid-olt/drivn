import { Link } from 'react-router';

type Props = React.ComponentProps<'a'>;
const Logo = (props: Props) => {
	return (
		<Link to="/" aria-label="logo" {...props}>
			<img src="/Drivn-logo.svg" className="max-h-8 dark:invert" alt="logo" />
		</Link>
	);
};

export default Logo;
