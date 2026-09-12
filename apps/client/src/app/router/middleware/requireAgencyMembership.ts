import authClient from '@/lib/auth-client';
import { requireAgency, requireSession } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

const requireAgencyMembership: MiddlewareFunction = async ({ request }, next) => {
	const agencies = await requireAgency(request);
	if (agencies.length === 0) throw redirect('/no-agency');

	const {
		session: { activeOrganizationId },
	} = await requireSession(request);

	if (!activeOrganizationId) {
		const defalutOrgId = agencies[0].id;
		await authClient.organization.setActive({ organizationId: defalutOrgId });
	}
	next();
};

export default requireAgencyMembership;
