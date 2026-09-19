import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import authClient from '@/lib/auth-client';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/reui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserMinusIcon, PaperPlaneTiltIcon, XIcon } from '@phosphor-icons/react';

const membersQueryKey = ['organization', 'members'];
const invitationsQueryKey = ['organization', 'invitations'];

export const Component = () => {
	const queryClient = useQueryClient();
	const [email, setEmail] = useState('');

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
	const memberRows = members.data ?? [];
	const invitationRows = invitations.data ?? [];

	const removeMember = useMutation({
		mutationFn: async (memberId: string) => {
			const result = await authClient.organization.removeMember({ memberIdOrEmail: memberId });
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: membersQueryKey }),
	});

	const inviteMember = useMutation({
		mutationFn: async (memberEmail: string) => {
			const result = await authClient.organization.inviteMember({
				email: memberEmail,
				role: 'member',
			});
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: async () => {
			setEmail('');
			await queryClient.invalidateQueries({ queryKey: invitationsQueryKey });
		},
	});

	const cancelInvitation = useMutation({
		mutationFn: async (invitationId: string) => {
			const result = await authClient.organization.cancelInvitation({ invitationId });
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
		<Tabs defaultValue="members" className="w-full">
			<TabsList>
				<TabsTrigger value="members">Members</TabsTrigger>
				<TabsTrigger value="invitations">Invitations</TabsTrigger>
			</TabsList>

			<TabsContent value="members" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Members</CardTitle>
						<CardDescription>People who can access this agency workspace.</CardDescription>
					</CardHeader>
					<CardContent>
						{members.isLoading ? (
							<p className="text-muted-foreground">Loading members...</p>
						) : members.isError ? (
							<p className="text-destructive">{members.error.message}</p>
						) : memberRows.length === 0 ? (
							<p className="text-muted-foreground">No members found.</p>
						) : (
							<div className="divide-y">
								{memberRows.map((member) => (
									<div key={member.id} className="flex items-center justify-between gap-4 py-3">
										<div className="min-w-0">
											<p className="truncate font-medium">{member.user.name}</p>
											<p className="truncate text-muted-foreground">{member.user.email}</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant="secondary">{member.role}</Badge>
											<Button
												variant="ghost"
												size="icon-sm"
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
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="invitations" className="mt-4 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Invite a member</CardTitle>
						<CardDescription>Send an email invitation to join this agency.</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							className="flex flex-col gap-3 sm:flex-row sm:items-end"
							onSubmit={(event) => {
								event.preventDefault();
								if (!email) return;
								void runAction(inviteMember.mutateAsync(email), {
									loading: 'Sending invitation...',
									success: 'Invitation sent.',
									error: 'Could not send invitation.',
								});
							}}
						>
							<div className="flex-1 space-y-1.5">
								<Label htmlFor="member-email">Email address</Label>
								<Input
									id="member-email"
									type="email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="member@example.com"
								/>
							</div>
							<Button type="submit" disabled={inviteMember.isPending}>
								<PaperPlaneTiltIcon />
								Send invite
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pending invitations</CardTitle>
					</CardHeader>
					<CardContent>
						{invitations.isLoading ? (
							<p className="text-muted-foreground">Loading invitations...</p>
						) : invitations.isError ? (
							<p className="text-destructive">{invitations.error.message}</p>
						) : invitationRows.length === 0 ? (
							<p className="text-muted-foreground">No pending invitations.</p>
						) : (
							<div className="divide-y">
								{invitationRows.map((invitation) => (
									<div key={invitation.id} className="flex items-center justify-between gap-4 py-3">
										<div className="min-w-0">
											<p className="truncate font-medium">{invitation.email}</p>
											<p className="text-muted-foreground">{invitation.status}</p>
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
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
};
