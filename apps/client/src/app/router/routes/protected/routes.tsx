import { type RouteObject } from 'react-router';
import Profile from '@/pages/protected/Profile';
import NoAgency from '@/features/agency/pages/NoAgency';
import EmailVerificationRequestPage from '@/pages/public/EmailVerificationRequestPage';
import requireUserAuth from '../../middleware/requireUserAuth';
import requireUserOfType from '../../middleware/requireUserOfType';
import requireVerifiedUser from '../../middleware/requireVerifiedUser';
import requireAgencyMembership from '../../middleware/requireAgencyMembership';
import requireNoAgency from '../../middleware/requireNoAgency';
import requireAgencyOnboarding from '../../middleware/requireAgencyOnBoarding';
import CreateAgency from '@/features/agency/pages/CreateAgency';
import AcceptInvitation from '@/features/agency/pages/AcceptInvitation';
import Loading from '@/components/ui/Loading';
import apiClient from '@/lib/api-client';
import AgencySetupCompleted from '@/features/agency/pages/AgencySetupCompleted';

/**
 * @description
 * These are the protected routes for the application.
 * They will combine both customer and agency routes, which will
 * be protected by authentication and authorization.
 */
export default [
	{
		middleware: [requireUserAuth],
		children: [
			// Agency-member-only area
			{
				middleware: [requireUserOfType(['agency_member']), requireVerifiedUser],
				children: [
					{
						middleware: [requireAgencyMembership],
						hydrateFallbackElement: <Loading />,
						children: [
							{
								path: '/agency',
								lazy: () => import('@/features/agency/pages/Agency'),
								middleware: [requireAgencyOnboarding],
							},
							{
								path: '/agency/setup-completed',
								element: <AgencySetupCompleted />,
							},
							{
								path: '/agency/onboarding',
								loader: async () => {
									const [err, res] = await apiClient.agency.getActive();
									if (err) throw err;
									const { success } = res;
									if (!success) throw new Error(res.message);
									return res.data;
								},
								lazy: () => import('@/features/agency/pages/AgencyOnboarding'),
							},
						],
					},
					{
						middleware: [requireNoAgency],
						children: [
							{
								path: '/no-agency',
								element: <NoAgency />,
							},
							{
								path: '/agency/new',
								element: <CreateAgency />,
							},
						],
					},
					{
						path: '/accept-invitation/:invitationId',
						element: <AcceptInvitation />,
					},
				],
			},
			// Customer-only area
			{
				middleware: [requireUserOfType(['customer']), requireVerifiedUser],
				children: [
					{
						path: '/profile',
						element: <Profile />,
					},
				],
			},
			// Any authenticated user
			{
				path: '/verify-email/request',
				element: <EmailVerificationRequestPage />,
			},
		],
	},
] as RouteObject[];
