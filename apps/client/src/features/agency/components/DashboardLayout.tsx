import {
	CarIcon,
	ChartLineUpIcon,
	MapPinIcon,
	UsersThreeIcon,
	CalendarCheckIcon,
	CommandIcon,
	CrownIcon,
	ShieldStarIcon,
	UserIcon,
} from '@phosphor-icons/react';
import { Link, Outlet, useLocation, useMatches, useNavigate } from 'react-router';
import type { ComponentType } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/reui/badge';
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
import { useAgency, useMembership, useSession } from '@/lib/auth-hooks';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { toast } from '@/components/ui/toast';
import { SignOutIcon, UserCircleIcon } from '@phosphor-icons/react';
import { Typography } from '@/components/ui/typography';
import { getAvatarColor, getInitials } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@ui/tooltip';
import type { Agency } from '@drivn/shared';
import { useEffect, useState } from 'react';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@ui/separator';

const navigation = [
	{
		label: 'Overview',
		href: '/agency',
		icon: ChartLineUpIcon,
		roles: ['member', 'admin', 'owner'],
	},
	{
		label: 'Fleet',
		href: '/agency/fleet',
		icon: CarIcon,
		roles: ['member', 'admin', 'owner'],
	},
	{
		label: 'Reservations',
		href: '/agency/reservations',
		icon: CalendarCheckIcon,
		roles: ['member', 'admin', 'owner'],
	},
	{
		label: 'Locations',
		href: '/agency/locations',
		icon: MapPinIcon,
		roles: ['member', 'admin', 'owner'],
	},
	{
		label: 'Team',
		href: '/agency/team',
		icon: UsersThreeIcon,
		roles: ['admin', 'owner'],
	},
];

const DashboardLayout = () => {
	const { data: agency } = useAgency();
	const session = useSession();
	const location = useLocation();
	const matches = useMatches();
	const { data: membership } = useMembership();

	const navigate = useNavigate();
	const handle = [...matches]
		.reverse()
		.map((match) => match.handle as { headerContent?: ComponentType; title?: string } | undefined)
		.find(Boolean);

	const HeaderContent = handle?.headerContent;
	const title = `Dashboard - ${handle?.title}`;

	const user = session.data?.user;
	if (!user) {
		throw new Error('Unable to load the authenticated user.');
	}

	const handleSignOut = async () => {
		const { error } = await authClient.signOut();
		if (error) {
			toast.add({ type: 'error', title: 'Unable to sign out.' });
			return;
		}
		queryClient.clear();
		navigate('/login', { replace: true });
	};
	useEffect(() => {
		document.title = title;
	}, [title]);

	return (
		<SidebarProvider defaultOpen={false}>
			<div className="flex min-h-svh w-full flex-col">
				<div className="flex min-h-0 flex-1 w-full">
					<DashboardSidebar
						membership={membership}
						agency={agency}
						user={user}
						pathname={location.pathname}
						onSignOut={handleSignOut}
					/>
					<SidebarInset className="min-w-0">
						<header className="flex h-12 shrink-0 items-center gap-3 border-b px-2 sticky top-0 z-10 bg-background/80 backdrop-blur-md md:px-4">
							<SidebarTrigger size="icon-lg" className={'md:hidden'} />
							<Separator orientation="vertical" className={'h-8 my-auto md:hidden'} />
							{HeaderContent ? <HeaderContent /> : null}
						</header>
						<main className="flex flex-1 flex-col gap-6 p-4">
							<Outlet />
						</main>
					</SidebarInset>
				</div>
			</div>
		</SidebarProvider>
	);
};

type DashboardSidebarProps = {
	agency: Agency;
	membership: typeof authClient.$Infer.Member;
	user: {
		name: string;
		email: string;
		image?: string | null;
	};

	pathname: string;
	onSignOut: () => Promise<void>;
};

function DashboardSidebar({
	agency,
	user,
	pathname,
	onSignOut,
	membership,
}: DashboardSidebarProps) {
	return (
		<Sidebar variant="sidebar" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DashboardSidebarToggle agency={agency} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation
								.filter((link) => link.roles.includes(membership.role))
								.map(({ label, href, icon: Icon }) => (
									<SidebarMenuItem key={href}>
										<SidebarMenuButton
											isActive={
												pathname === href || (href !== '/agency' && pathname.startsWith(`${href}/`))
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
				<UserMenu membership={membership} user={user} onSignOut={onSignOut} />
			</SidebarFooter>
		</Sidebar>
	);
}

type UserMenuProps = {
	user: DashboardSidebarProps['user'];
	membership: typeof authClient.$Infer.Member;
	onSignOut: () => Promise<void>;
};

function UserMenu({ user, membership, onSignOut }: UserMenuProps) {
	const { isMobile } = useSidebar();
	const role = membership.role;
	const roleConfig = {
		owner: { label: 'Owner', icon: CrownIcon },
		admin: { label: 'Admin', icon: ShieldStarIcon },
		member: { label: 'Member', icon: UserIcon },
	}[role];
	const initials = getInitials(user.name);
	const avatarColor = getAvatarColor(user.name);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="rounded-full" />}>
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
					<DropdownMenuContent
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						className="min-w-56"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="flex items-center justify-between gap-3">
								<span className="truncate">{user.name}</span>
								<Badge variant="secondary" size="sm" radius="full">
									<roleConfig.icon aria-hidden="true" />
									{roleConfig.label}
								</Badge>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<UserCircleIcon />
							Account
						</DropdownMenuItem>
						<DropdownMenuItem variant="destructive" onClick={onSignOut}>
							<SignOutIcon />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

type DashboardSidebarToggleProps = {
	agency: Agency;
};

function DashboardSidebarToggle({ agency }: DashboardSidebarToggleProps) {
	const { isMobile, state } = useSidebar();
	const [isHovering, setIsHovering] = useState(false);

	if (isMobile) {
		return (
			<div className="flex w-full items-center justify-between gap-2">
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
				<SidebarTrigger size="icon-lg" />
			</div>
		);
	}

	// If collapsed and hovering, show the trigger version
	if (state === 'collapsed' && isHovering) {
		return (
			<Tooltip>
				<TooltipTrigger>
					<SidebarTrigger
						onPointerLeave={() => setIsHovering(false)}
						size="icon-lg"
						nativeButton={false}
					>
						<SidebarMenuButton size="lg" className="flex items-center justify-center h-8" />
					</SidebarTrigger>
				</TooltipTrigger>
				<TooltipContent side="right">
					Open sidebar{' '}
					<KbdGroup>
						{' '}
						<Kbd>Ctrl</Kbd> <span>+</span> <Kbd>b</Kbd>{' '}
					</KbdGroup>
				</TooltipContent>
			</Tooltip>
		);
	}

	// Default version (Expanded OR collapsed when not hovering)
	return (
		<div
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
							<SidebarTrigger
								onPointerLeave={() => setIsHovering(false)}
								size="icon-lg"
								nativeButton={false}
							>
								<SidebarMenuButton size="lg" className="flex items-center justify-center h-8" />
							</SidebarTrigger>
						</TooltipTrigger>
						<TooltipContent side="right">
							Close sidebar
							<KbdGroup>
								{' '}
								<Kbd>Ctrl</Kbd> <span>+</span> <Kbd>b</Kbd>{' '}
							</KbdGroup>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</div>
	);
}

export default DashboardLayout;
