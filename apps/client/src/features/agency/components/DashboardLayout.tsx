import {
	BuildingsIcon,
	CarIcon,
	ChartLineUpIcon,
	MapPinIcon,
	UsersThreeIcon,
	CalendarCheckIcon,
	CommandIcon,
} from '@phosphor-icons/react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAgency, useSession } from '@/lib/auth-hooks';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { toast } from '@/components/ui/toast';
import { SignOutIcon, UserCircleIcon } from '@phosphor-icons/react';

const navigation = [
	{ label: 'Overview', href: '/agency', icon: ChartLineUpIcon },
	{ label: 'Cars', href: '/agency/cars', icon: CarIcon },
	{ label: 'Reservations', href: '/agency/reservations', icon: CalendarCheckIcon },
	{ label: 'Locations', href: '/agency/locations', icon: MapPinIcon },
	{ label: 'Members', href: '/agency/members', icon: UsersThreeIcon },
];

const avatarColors = ['#2563eb', '#9333ea', '#db2777', '#ea580c', '#16a34a', '#0891b2'];

const DashboardLayout = () => {
	const agency = useAgency();
	const session = useSession();
	const location = useLocation();
	const navigate = useNavigate();

	if (agency.isPending || session.isPending) {
		return <div className="flex min-h-svh items-center justify-center text-muted-foreground">Loading dashboard...</div>;
	}

	if (agency.isError || !agency.data || session.isError || !session.data?.data) {
		return <div className="flex min-h-svh items-center justify-center text-muted-foreground">Unable to load the dashboard.</div>;
	}

	const user = session.data.data.user;
	const initials = user.name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
	const avatarColor = avatarColors[user.name.length % avatarColors.length];

	const handleSignOut = async () => {
		const { error } = await authClient.signOut();
		if (error) {
			toast.add({ type: 'error', title: 'Unable to sign out.' });
			return;
		}
		queryClient.clear();
		navigate('/login');
	};

	return (
		<SidebarProvider>
			<Sidebar variant="inset">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" render={<Link to="/agency" />}>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									{agency.data.logo ? (
										<Avatar className="size-8 rounded-lg">
											<AvatarImage src={agency.data.logo} alt="" />
											<AvatarFallback>{agency.data.name.slice(0, 1).toUpperCase()}</AvatarFallback>
										</Avatar>
									) : (
										<CommandIcon className="size-4" />
									)}
								</div>
								<span className="truncate font-medium">{agency.data.name}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navigation.map(({ label, href, icon: Icon }) => (
									<SidebarMenuItem key={href}>
										<SidebarMenuButton
											isActive={location.pathname === href || (href !== '/agency' && location.pathname.startsWith(`${href}/`))}
											render={<Link to={href} />}
										>
											<Icon />
											<span>{label}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
									<Avatar>
										<AvatarImage src={user.image ?? undefined} alt={user.name} />
										<AvatarFallback className="text-white" style={{ backgroundColor: avatarColor }}>
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="right" align="end" className="min-w-56">
									<DropdownMenuGroup>
										<DropdownMenuLabel>{user.name}</DropdownMenuLabel>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<UserCircleIcon />
										Account
									</DropdownMenuItem>
									<DropdownMenuItem variant="destructive" onClick={handleSignOut}>
										<SignOutIcon />
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<BuildingsIcon className="size-4" />
						<span>{agency.data.name}</span>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;
