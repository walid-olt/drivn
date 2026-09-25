import {
	BuildingsIcon,
	ListIcon as Menu,
	SignInIcon,
	UserPlusIcon,
	XIcon as Close,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Link } from 'react-router';
import Logo from './Logo';

const Navbar = () => {
	return (
		<header className="sticky top-0 z-50 bg-background/80 py-4 backdrop-blur-sm">
			<nav className="flex items-center justify-between">
				<Logo className="flex items-center gap-2" />

				<div className="hidden gap-2 sm:flex">
					<Button variant="ghost" size="lg" render={<Link to="/agency" />} nativeButton={false}>
						<BuildingsIcon data-icon="inline-start" />
						Agency Portal
					</Button>
					<Button variant="outline" size="lg" render={<Link to="/login" />} nativeButton={false}>
						<SignInIcon data-icon="inline-start" />
						Login
					</Button>
					<Button size="lg" render={<Link to="/register/agency" />} nativeButton={false}>
						<UserPlusIcon data-icon="inline-start" />
						Get Started
					</Button>
				</div>

				<Sheet>
					<SheetTrigger
						render={
							<Button variant="outline" size="icon-lg" className="sm:hidden">
								<Menu />
							</Button>
						}
					/>
					<SheetContent showCloseButton={false} className="w-3/4 overflow-y-auto sm:max-w-sm">
						<SheetHeader>
							<div className="flex items-center justify-between">
								<SheetTitle>
									<Link to="/" aria-label="logo" className="flex items-center gap-2">
										<img src="/Drivn-logo.svg" className="max-h-8 dark:invert" alt="logo" />
									</Link>
								</SheetTitle>
								<SheetClose
									render={
										<Button variant={'outline'} size={'icon-lg'}>
											<Close />
										</Button>
									}
								/>
							</div>
						</SheetHeader>
						<div className="flex flex-col gap-2 p-4 pt-6">
							<Button
								variant="default"
								render={<Link to="/register/agency" />}
								nativeButton={false}
							>
								<UserPlusIcon data-icon="inline-start" />
								Get Started
							</Button>
							<Button variant="outline" render={<Link to="/login" />} nativeButton={false}>
								<SignInIcon data-icon="inline-start" />
								Login
							</Button>
							<Button variant="ghost" render={<Link to="/agency" />} nativeButton={false}>
								<BuildingsIcon data-icon="inline-start" />
								Agency Portal
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
};

export default Navbar;
