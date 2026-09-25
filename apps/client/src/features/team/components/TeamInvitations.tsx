import { useState } from 'react';
import { ArrowUpRightIcon, PaperPlaneTiltIcon, XIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/reui/badge';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import {
	organizationRoles,
	type OrganizationRole,
	useCancelInvitationMutation,
	useInviteMemberMutation,
} from '../hooks';

type Invitation = { id: string; email: string };

type TeamInvitationsProps = {
	invitations: Invitation[];
};

export function TeamInvitations({ invitations }: TeamInvitationsProps) {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<OrganizationRole>('member');
	const inviteMember = useInviteMemberMutation();
	const cancelInvitation = useCancelInvitationMutation();

	const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!email) return;

		await toast.promise(inviteMember.mutateAsync({ email, role }), {
			loading: 'Sending invitation...',
			success: 'Invitation sent.',
			error: 'Could not send invitation.',
		});
		setEmail('');
		setRole('member');
	};

	const handleCancel = async (invitationId: string) => {
		await toast.promise(cancelInvitation.mutateAsync(invitationId), {
			loading: 'Cancelling invitation...',
			success: 'Invitation cancelled.',
			error: 'Could not cancel invitation.',
		});
	};

	return (
		<div className="space-y-4">
			<div className="rounded-xl border bg-card p-5 sm:p-6">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<Typography variant="bodyStrong">Bring someone in</Typography>
						<Typography variant="caption" className="mt-0.5">
							They’ll receive a link to join your agency.
						</Typography>
					</div>
					<ArrowUpRightIcon className="size-4 text-muted-foreground" />
				</div>
				<form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleInvite}>
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
				<div className="flex items-center justify-between border-b px-5 py-4">
					<Typography variant="bodyStrong">Pending invitations</Typography>
					<Badge variant="secondary" size="sm" radius="full">
						{invitations.length}
					</Badge>
				</div>
				<div className="px-2 sm:px-3">
					{invitations.length === 0 ? (
						<Typography variant="caption" className="px-3 py-8">
							No invitations waiting for a response.
						</Typography>
					) : (
						<div className="divide-y">
							{invitations.map((invitation) => (
								<div
									key={invitation.id}
									className="flex items-center justify-between gap-4 px-2 py-3.5"
								>
									<div className="min-w-0">
										<Typography variant="bodyStrong" className="truncate">
											{invitation.email}
										</Typography>
										<Typography variant="caption">Invitation pending</Typography>
									</div>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label={`Cancel invitation for ${invitation.email}`}
										disabled={cancelInvitation.isPending}
										onClick={() => void handleCancel(invitation.id)}
									>
										<XIcon />
									</Button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
