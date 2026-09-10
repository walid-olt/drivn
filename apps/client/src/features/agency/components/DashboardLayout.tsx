import {
	CarIcon,
	ChartLineUpIcon,
	MapPinIcon,
	UsersThreeIcon,
	CalendarCheckIcon,
	CommandIcon,
	SidebarSimpleIcon,
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
import { Typography } from '@/components/ui/typography';
import { getAvatarColor, getInitials } from '@/lib/utils';

const navigation = [
	{ label: 'Overview', href: '/agency', icon: ChartLineUpIcon },
	{ label: 'Cars', href: '/agency/cars', icon: CarIcon },
	{
		label: 'Reservations',
		href: '/agency/reservations',
		icon: CalendarCheckIcon,
	},
	{ label: 'Locations', href: '/agency/locations', icon: MapPinIcon },
	{ label: 'Members', href: '/agency/members', icon: UsersThreeIcon },
];

const DashboardLayout = () => {
	const agency = useAgency();
	const session = useSession();
	const location = useLocation();
	const navigate = useNavigate();

	const user = session.data.data?.user;
	if (!user) {
		throw new Error('Unable to load the authenticated user.');
	}
	const initials = getInitials(user.name);
	const avatarColor = getAvatarColor(user.name);
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
		<SidebarProvider defaultOpen={false}>
			<Sidebar variant="sidebar" collapsible="icon">
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
								<Typography variant={'h4'} className="truncate font-medium">
									{agency.data.name}
								</Typography>
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
											isActive={
												location.pathname === href ||
												(href !== '/agency' && location.pathname.startsWith(`${href}/`))
											}
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
					<SidebarTrigger render={<SidebarSimpleIcon />}></SidebarTrigger>
				</header>
				<main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;
