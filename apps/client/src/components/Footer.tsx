import { Link } from 'react-router';

const footerLinks = [
	{ title: 'Agency Portal', url: '/agency' },
	{ title: 'Create Agency', url: '/register/agency' },
	{ title: 'Sign In', url: '/login' },
];

const Footer = () => {
	return (
		<footer className="border-t border-border bg-background">
			<div className="flex flex-col gap-8 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
				<div className="flex flex-col gap-2">
					<Link to="/" className="flex w-fit items-center gap-2">
						<img src="/Drivn-logo.svg" alt="Drivn" className="max-h-7 dark:invert" />
					</Link>
					<p className="text-sm text-muted-foreground">Fleet & rental operations</p>
				</div>
				<nav aria-label="Footer" className="flex flex-wrap items-center gap-1">
					{footerLinks.map((link) => (
						<Link
							key={link.title}
							to={link.url}
							className="rounded-md px-3 py-1.5 text-xs/relaxed font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							{link.title}
						</Link>
					))}
				</nav>
			</div>
			<div className="border-t border-border px-4 py-4 sm:px-8 lg:px-12">
				<p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Drivn</p>
			</div>
		</footer>
	);
};

export default Footer;
