import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import authClient from '@/lib/auth-client';
import { useSession } from '@/lib/auth-hooks';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/reui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	UserMinusIcon,
	PaperPlaneTiltIcon,
	XIcon,
	UserListIcon,
	UserPlusIcon,
	ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { getAvatarColor, getInitials } from '@/lib/utils';

const membersQueryKey = ['organization', 'members'];
const invitationsQueryKey = ['organization', 'invitations'];
const organizationRoles = ['member', 'admin', 'owner'] as const;
type OrganizationRole = (typeof organizationRoles)[number];

export const Component = () => {
	const queryClient = useQueryClient();
	const session = useSession();
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<OrganizationRole>('member');

	const members = useQuery({
		queryKey: membersQueryKey,
		queryFn: async () => {
			const result = await authClient.organization.listMembers({});
			if (result.error) throw new Error(result.error.message);
			return result.data?.members ?? [];
		},
	});

	const invitations = useQuery({
		queryKey: invitationsQueryKey,
		queryFn: async () => {
			const result = await authClient.organization.listInvitations({});
			if (result.error) throw new Error(result.error.message);
			return result.data ?? [];
		},
	});
	const currentUser = session.data.data?.user;
	const allMemberRows = members.data ?? [];
	const memberRows = allMemberRows.filter(
		(member) => member.user.id !== currentUser?.id && member.user.email !== currentUser?.email,
	);
	const memberCount = allMemberRows.length;
	const invitationRows = invitations.data ?? [];

	const removeMember = useMutation({
		mutationFn: async (memberId: string) => {
			const result = await authClient.organization.removeMember({
				memberIdOrEmail: memberId,
			});
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: membersQueryKey }),
	});

	const inviteMember = useMutation({
		mutationFn: async ({
			memberEmail,
			memberRole,
		}: {
			memberEmail: string;
			memberRole: OrganizationRole;
		}) => {
			const result = await authClient.organization.inviteMember({
				email: memberEmail,
				role: memberRole,
			});

			// throw so error boundary can display the fallback
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: async () => {
			setEmail('');
			setRole('member');
			await queryClient.invalidateQueries({ queryKey: invitationsQueryKey });
		},
	});

	const cancelInvitation = useMutation({
		mutationFn: async (invitationId: string) => {
			const result = await authClient.organization.cancelInvitation({
				invitationId,
			});
			// throw so error boundary can display the fallback
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationsQueryKey }),
	});

	const runAction = async <T,>(
		promise: Promise<T>,
		messages: {
			loading: string;
			success: string;
			error: string;
		},
	) => {
		await toast.promise(promise, messages);
	};

	return (
		<Tabs defaultValue="members" className="w-full max-w-4xl gap-6">
			<div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 text-primary-foreground shadow-sm sm:px-8">
				<div className="pointer-events-none absolute -right-8 -bottom-20 size-56 rounded-full border-[28px] border-primary-foreground/10" />
				<div className="pointer-events-none absolute right-20 -top-16 size-32 rounded-full border-[18px] border-primary-foreground/10" />
				<div className="relative max-w-xl">
					<p className="mb-2 text-xs font-medium tracking-[0.18em] text-primary-foreground/70 uppercase">
						Workspace access
					</p>
					<h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
						Your people, in one place.
					</h1>
					<p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/75">
						Keep the agency moving with the right people around the wheel.
					</p>
				</div>
				<div className="relative mt-7 flex gap-8 border-t border-primary-foreground/15 pt-4">
					<div>
						<p className="text-2xl font-medium">{memberCount}</p>
						<p className="text-xs text-primary-foreground/65">People with access</p>
					</div>
					<div>
						<p className="text-2xl font-medium">{invitationRows.length}</p>
						<p className="text-xs text-primary-foreground/65">Pending invites</p>
					</div>
				</div>
			</div>

			<TabsList variant="line" className="w-full justify-start border-b">
				<TabsTrigger value="members">
					<UserListIcon />
					Members <span className="text-muted-foreground">({memberCount})</span>
				</TabsTrigger>
				<TabsTrigger value="invitations">
					<UserPlusIcon />
					Invitations <span className="text-muted-foreground">({invitationRows.length})</span>
				</TabsTrigger>
			</TabsList>

			<TabsContent value="members" className="mt-0">
				<div className="overflow-hidden rounded-xl border bg-card">
					<div className="flex items-center justify-between border-b px-5 py-4">
						<div>
							<h2 className="text-sm font-medium">People with access</h2>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Everyone who can work in this agency.
							</p>
						</div>
						<Badge variant="secondary" size="sm" radius="full">
							{memberCount} total
						</Badge>
					</div>
					<div className="px-2 sm:px-3">
						{members.isLoading ? (
							<p className="px-3 py-8 text-sm text-muted-foreground">Loading people...</p>
						) : members.isError ? (
							<p className="px-3 py-8 text-sm text-destructive">{members.error.message}</p>
						) : memberRows.length === 0 ? (
							<p className="px-3 py-8 text-sm text-muted-foreground">
								No other members yet. Invite someone to get started.
							</p>
						) : (
							<div className="divide-y">
								{memberRows.map((member) => (
									<div
										key={member.id}
										className="group flex items-center justify-between gap-4 px-2 py-3.5"
									>
										<div className="flex min-w-0 items-center gap-3">
											<Avatar>
												<AvatarImage src={member.user.image ?? undefined} alt="" />
												<AvatarFallback
													className="text-xs text-white"
													style={{ backgroundColor: getAvatarColor(member.user.name) }}
												>
													{getInitials(member.user.name)}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">{member.user.name}</p>
												<p className="truncate text-xs text-muted-foreground">
													{member.user.email}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant="secondary" size="sm" radius="full" className="capitalize">
												{member.role}
											</Badge>
											<Button
												variant="ghost"
												size="icon-sm"
												className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
												aria-label={`Remove ${member.user.name}`}
												disabled={removeMember.isPending}
												onClick={() =>
													runAction(removeMember.mutateAsync(member.id), {
														loading: 'Removing member...',
														success: 'Member removed.',
														error: 'Could not remove member.',
													})
												}
											>
												<UserMinusIcon />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</TabsContent>

			<TabsContent value="invitations" className="mt-0 space-y-4">
				<div className="rounded-xl border bg-card p-5 sm:p-6">
					<div className="mb-5 flex items-start justify-between gap-4">
						<div>
							<h2 className="text-sm font-medium">Bring someone in</h2>
							<p className="mt-0.5 text-xs text-muted-foreground">
								They’ll receive a link to join your agency.
							</p>
						</div>
						<ArrowUpRightIcon className="size-4 text-muted-foreground" />
					</div>
					<form
						className="flex flex-col gap-3 sm:flex-row sm:items-end"
						onSubmit={(event) => {
							event.preventDefault();
							if (!email) return;
							void runAction(inviteMember.mutateAsync({ memberEmail: email, memberRole: role }), {
								loading: 'Sending invitation...',
								success: 'Invitation sent.',
								error: 'Could not send invitation.',
							});
						}}
					>
						<div className="flex-1 space-y-1.5">
							<Label htmlFor="member-email">Email address</Label>
							<InputGroup className="h-9">
								<InputGroupInput
									id="member-email"
									type="email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="member@example.com"
								/>
								<InputGroupButton
									type="submit"
									size="sm"
									variant="default"
									disabled={inviteMember.isPending}
								>
									<PaperPlaneTiltIcon />
									Invite member
								</InputGroupButton>
							</InputGroup>
						</div>
						<div className="space-y-1.5 sm:w-32">
							<Label htmlFor="member-role">Role</Label>
							<Select value={role} onValueChange={(value) => setRole(value as OrganizationRole)}>
								<SelectTrigger id="member-role" className="h-9 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{organizationRoles.map((option) => (
										<SelectItem key={option} value={option} className="capitalize">
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</form>
				</div>

				<div className="overflow-hidden rounded-xl border bg-card">
					<div className="border-b px-5 py-4">
						<h2 className="text-sm font-medium">Pending invitations</h2>
					</div>
					<div className="px-2 sm:px-3">
						{invitations.isLoading ? (
							<p className="px-3 py-8 text-sm text-muted-foreground">Loading invitations...</p>
						) : invitations.isError ? (
							<p className="px-3 py-8 text-sm text-destructive">{invitations.error.message}</p>
						) : invitationRows.length === 0 ? (
							<p className="px-3 py-8 text-sm text-muted-foreground">
								No invitations waiting for a response.
							</p>
						) : (
							<div className="divide-y">
								{invitationRows.map((invitation) => (
									<div
										key={invitation.id}
										className="flex items-center justify-between gap-4 px-2 py-3.5"
									>
										<div className="min-w-0">
											<p className="truncate text-sm font-medium">{invitation.email}</p>
											<p className="text-xs text-muted-foreground">Invitation pending</p>
										</div>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`Cancel invitation for ${invitation.email}`}
											disabled={cancelInvitation.isPending}
											onClick={() =>
												runAction(cancelInvitation.mutateAsync(invitation.id), {
													loading: 'Cancelling invitation...',
													success: 'Invitation cancelled.',
													error: 'Could not cancel invitation.',
												})
											}
										>
											<XIcon />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
};
