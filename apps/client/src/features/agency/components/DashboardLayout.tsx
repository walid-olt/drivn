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
	useSidebar,
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
import { Tooltip, TooltipTrigger, TooltipContent } from '@ui/tooltip';
import type { Agency } from '@drivn/shared';
import { useState } from 'react';

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
							<DashboardSidebarToggle agency={agency.data} />
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
				<main className="flex flex-1 flex-col gap-6 p-2">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

type DashboardSidebarToogleProps = {
	agency: Agency;
};
function DashboardSidebarToggle({ agency }: DashboardSidebarToogleProps) {
	const { state } = useSidebar();
	const [isHovering, setIsHovering] = useState(false);

	// If collapsed and hovering, show the trigger version
	if (state === 'collapsed' && isHovering) {
		return (
			<Tooltip>
				<TooltipTrigger>
					<SidebarMenuButton
						size="lg"
						className="flex items-center justify-center"
						onPointerLeave={() => setIsHovering(false)}
					>
						<SidebarTrigger
							className="cursor-pointer"
							size="icon-lg"
							render={<SidebarSimpleIcon />}
						/>
					</SidebarMenuButton>
				</TooltipTrigger>
				<TooltipContent side="right">Open sidebar</TooltipContent>
			</Tooltip>
		);
	}

	// Default version (Expanded OR collapsed when not hovering)
	return (
		<SidebarMenuItem
			className="flex items-center gap-2 "
			onPointerEnter={() => {
				if (state === 'collapsed') setIsHovering(true);
			}}
		>
			<div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
				{agency.logo ? (
					<Avatar className="size-8">
						<AvatarImage src={agency.logo} alt="" />
						<AvatarFallback>{agency.name.slice(0, 1).toUpperCase()}</AvatarFallback>
					</Avatar>
				) : (
					<CommandIcon className="size-4" />
				)}
			</div>

			{state === 'expanded' && (
				<div className="flex justify-between items-center w-full">
					<Typography variant="h4" className="truncate font-medium">
						{agency.name}
					</Typography>
					<Tooltip>
						<TooltipTrigger>
							<SidebarMenuButton size="lg" className="flex items-center justify-center h-8">
								<SidebarTrigger
									onPointerLeave={() => setIsHovering(false)}
									className="cursor-pointer"
									size="icon-lg"
									render={<SidebarSimpleIcon />}
								/>
							</SidebarMenuButton>
						</TooltipTrigger>
						<TooltipContent side="right">Close sidebar</TooltipContent>
					</Tooltip>
				</div>
			)}
		</SidebarMenuItem>
	);
}

export default DashboardLayout;
