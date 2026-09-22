import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import authClient from '@/lib/auth-client';
import { QUERY_KEYS } from '@/lib/query-keys';

export const organizationRoles = ['member', 'admin', 'owner'] as const;
export type OrganizationRole = (typeof organizationRoles)[number];

const fetchMembers = async () => {
	const result = await authClient.organization.listMembers();
	if (result.error) throw new Error(result.error.message);
	return result.data.members;
};

const fetchInvitations = async () => {
	const result = await authClient.organization.listInvitations({});
	if (result.error) throw new Error(result.error.message);
	return result.data.filter((invitation) => invitation.status === 'pending');
};

export const useTeamData = () => {
	// run multiple queries in parallel using useSuspenseQueries
	const [{ data: members }, { data: invitations }] = useSuspenseQueries({
		queries: [
			{
				queryKey: QUERY_KEYS.organizationMembers,
				queryFn: fetchMembers,
			},
			{
				queryKey: QUERY_KEYS.organizationInvitations,
				queryFn: fetchInvitations,
			},
		],
	});

	return { members, invitations };
};

export const useRemoveMemberMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (memberId: string) => {
			const result = await authClient.organization.removeMember({
				memberIdOrEmail: memberId,
			});
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.organizationMembers,
			}),
	});
};

export const useInviteMemberMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ email, role }: { email: string; role: OrganizationRole }) => {
			const result = await authClient.organization.inviteMember({
				email,
				role,
			});
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.organizationInvitations,
			}),
	});
};

export const useCancelInvitationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (invitationId: string) => {
			const result = await authClient.organization.cancelInvitation({
				invitationId,
			});
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.organizationInvitations,
			}),
	});
};
