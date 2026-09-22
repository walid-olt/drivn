import { CrownIcon, ShieldStarIcon, UserIcon, UserMinusIcon } from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/reui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { getAvatarColor, getInitials } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';
import { useRemoveMemberMutation } from '../hooks/team';
import type authClient from '@/lib/auth-client';

type Member = typeof authClient.$Infer.Member;

type TeamMembersProps = {
	members: Member[];
	currentUserId?: string;
	currentUserEmail?: string;
};

const roleConfig = {
	owner: { label: 'Owner', icon: CrownIcon },
	admin: { label: 'Admin', icon: ShieldStarIcon },
	member: { label: 'Member', icon: UserIcon },
} as const;

export function TeamMembers({ members, currentUserId, currentUserEmail }: TeamMembersProps) {
	const { mutateAsync: removeMember, isPending } = useRemoveMemberMutation();
	const memberRows = members.filter(
		(member) => member.user.id !== currentUserId && member.user.email !== currentUserEmail,
	);

	const handleRemove = async (member: Member) => {
		await toast.promise(removeMember(member.id), {
			loading: 'Removing member...',
			success: 'Member removed.',
			error: 'Could not remove member.',
		});
	};

	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<div className="flex items-center justify-between border-b px-5 py-4">
				<div>
					<Typography variant="bodyStrong">People with access</Typography>
					<Typography variant="caption" className="mt-0.5">
						Everyone who can work in this agency.
					</Typography>
				</div>
				<Badge variant="secondary" size="sm" radius="full">
					{members.length} total
				</Badge>
			</div>
			<div className="px-2 sm:px-3">
				{memberRows.length === 0 ? (
					<Typography variant="caption" className="px-3 py-8">
						No other members yet. Invite someone to get started.
					</Typography>
				) : (
					<div className="divide-y">
						{memberRows.map((member) => (
							<div
								key={member.id}
								className="group flex items-center justify-between gap-4 px-2 py-3.5"
							>
								<div className="flex min-w-0 items-center gap-3">
									<Avatar>
										<AvatarImage src={member.user.image} />
										<AvatarFallback
											className="text-xs text-white"
											style={{
												backgroundColor: getAvatarColor(member.user.name),
											}}
										>
											{getInitials(member.user.name)}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<Typography variant="bodyStrong" className="truncate">
											{member.user.name}
										</Typography>
										<Typography variant="caption" className="truncate">
											{member.user.email}
										</Typography>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<RoleBadge role={member.role} />
									<Button
										variant="destructive"
										size="sm"
										disabled={isPending}
										onClick={() => handleRemove(member)}
									>
										<UserMinusIcon />
										Remove
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function RoleBadge({ role: roleName }: { role: string }) {
	const role = roleConfig[roleName as keyof typeof roleConfig] ?? roleConfig.member;

	return (
		<Badge
			variant="secondary"
			size="xl"
			radius="full"
			className="[&_svg:not([class*='size-'])]:size-4"
		>
			<role.icon aria-hidden="true" />
			{role.label}
		</Badge>
	);
}
