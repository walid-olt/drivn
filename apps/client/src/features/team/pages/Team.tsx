import { UserListIcon, UserPlusIcon } from '@phosphor-icons/react';
import { useSession } from '@/lib/auth-hooks';
import { Typography } from '@/components/ui/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamInvitations } from '../components/TeamInvitations';
import { TeamMembers } from '../components/TeamMembers';
import { useTeamData } from '../hooks';
export const Component = () => {
	const { data: session } = useSession();
	const { members, invitations } = useTeamData();
	const currentUser = session?.user;

	return (
		<Tabs defaultValue="members" className="w-full max-w-4xl gap-6">
			<TeamOverview memberCount={members.length} invitationCount={invitations.length} />
			<TabsList variant="line" className="w-full justify-start border-b">
				<TabsTrigger value="members">
					<UserListIcon />
					Members{' '}
					<Typography as="span" variant="caption">
						({members.length})
					</Typography>
				</TabsTrigger>
				<TabsTrigger value="invitations">
					<UserPlusIcon />
					Invitations{' '}
					<Typography as="span" variant="caption">
						({invitations.length})
					</Typography>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="members" className="mt-0">
				<TeamMembers
					members={members}
					currentUserId={currentUser?.id}
					currentUserEmail={currentUser?.email}
				/>
			</TabsContent>
			<TabsContent value="invitations" className="mt-0">
				<TeamInvitations invitations={invitations} />
			</TabsContent>
		</Tabs>
	);
};

function TeamOverview({
	memberCount,
	invitationCount,
}: {
	memberCount: number;
	invitationCount: number;
}) {
	return (
		<div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 text-primary-foreground shadow-sm sm:px-8">
			<div className="relative max-w-xl">
				<Typography
					variant="caption"
					className="mb-2 tracking-[0.18em] text-primary-foreground/70 uppercase"
				>
					Workspace access
				</Typography>
				<Typography as="h1" variant="h3" className="text-primary-foreground">
					Your people, in one place.
				</Typography>
				<Typography variant="caption" className="mt-2 max-w-md text-primary-foreground/75">
					Keep the agency moving with the right people around the wheel.
				</Typography>
			</div>
			<div className="relative mt-7 flex gap-8 border-t border-primary-foreground/15 pt-4">
				<TeamMetric label="People with access" value={memberCount} />
				<TeamMetric label="Pending invites" value={invitationCount} />
			</div>
		</div>
	);
}

function TeamMetric({ label, value }: { label: string; value: number }) {
	return (
		<div>
			<Typography variant="h3" className="text-primary-foreground">
				{value}
			</Typography>
			<Typography variant="caption" className="text-primary-foreground/65">
				{label}
			</Typography>
		</div>
	);
}
