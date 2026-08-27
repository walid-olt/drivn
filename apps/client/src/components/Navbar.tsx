import {
	BuildingsIcon,
	CarIcon,
	HouseIcon,
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
import { NavLink } from 'react-router';

const menu = [
	{ title: 'Home', url: '/', icon: <HouseIcon /> },
	{ title: 'Cars', url: '/cars', icon: <CarIcon /> },
	{ title: 'Agencies', url: '/agencies', icon: <BuildingsIcon /> },
];

const Navbar = () => {
	return (
		<header className="sticky top-0 z-50 bg-background/80 py-4 backdrop-blur-sm">
			<nav className="flex items-center justify-between">
				<div className="flex items-center gap-6">
					<a href="/" aria-label="logo" className="flex items-center gap-2">
						<img src="/Drivn-logo.svg" className="max-h-8 dark:invert" alt="logo" />
					</a>
					<div className="hidden items-center gap-1 lg:flex">
						{menu.map((item) => (
							<NavLink
								key={item.title}
								to={item.url}
								className={({ isActive }) =>
									`rounded-md px-3 py-1.5 text-xs/relaxed font-medium transition-colors hover:bg-muted ${isActive && 'text-primary'}`
								}
							>
								{item.title}
							</NavLink>
						))}
					</div>
				</div>

				<div className="hidden gap-2 lg:flex">
					<Button
						variant="ghost"
						size="lg"
						render={<a href="/for-agencies" />}
						nativeButton={false}
					>
						<BuildingsIcon data-icon="inline-start" />
						For Agencies
					</Button>
					<Button variant="outline" size="lg" render={<a href="#" />} nativeButton={false}>
						<SignInIcon data-icon="inline-start" />
						Login
					</Button>
					<Button size="lg" render={<a href="/login" />} nativeButton={false}>
						<UserPlusIcon data-icon="inline-start" />
						Sign up
					</Button>
				</div>

				<Sheet>
					<SheetTrigger
						render={
							<Button variant="outline" size="icon-lg" className="lg:hidden">
								<Menu />
							</Button>
						}
					/>
					<SheetContent showCloseButton={false} className="w-3/4 overflow-y-auto sm:max-w-sm">
						<SheetHeader>
							<div className="flex items-center justify-between">
								<SheetTitle>
									<a href="/" aria-label="logo" className="flex items-center gap-2">
										<img src="/Drivn-logo.svg" className="max-h-8 dark:invert" alt="logo" />
									</a>
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
						<div className="flex flex-col gap-1 p-4">
							{menu.map((item) => (
								<NavLink
									key={item.title}
									to={item.url}
									className={({ isActive }) =>
										`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${isActive && 'text-primary'}`
									}
								>
									{item.icon}
									{item.title}
								</NavLink>
							))}
							<div className="my-4 h-px bg-border" />
							<div className="flex flex-col gap-2 *:py-4">
								<Button variant="default" render={<a href="/for-agencies" />} nativeButton={false}>
									<BuildingsIcon data-icon="inline-start" />
									For Agencies
								</Button>
								<Button variant="outline" render={<a href="#" />} nativeButton={false}>
									<SignInIcon data-icon="inline-start" />
									Login
								</Button>
								<Button variant={'secondary'} render={<a href="#" />} nativeButton={false}>
									<UserPlusIcon data-icon="inline-start" />
									Sign up
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
};

export default Navbar;
