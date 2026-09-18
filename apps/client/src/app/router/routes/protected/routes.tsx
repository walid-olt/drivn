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
import DashboardLayout from '@/features/agency/components/DashboardLayout';
import { Suspense } from 'react';
import { Typography } from '@/components/ui/typography';
import FleetHeader from '@/features/fleet/components/FleetHeader';
import { FleetNewHeader } from '@/features/fleet/components/FleetNewHeader';

/**
 * @description
 * These are the protected routes for the application.
 * They will combine both customer and agency routes, which will
 * be protected by authentication and authorization.
 *
 * We use different middleware and nested routes to handle the
 * different user types and their access levels.
 */
export default [
	{
		middleware: [requireUserAuth],
		children: [
			{
				middleware: [requireUserOfType(['agency_member']), requireVerifiedUser],
				children: [
					{
						middleware: [requireAgencyMembership],
						hydrateFallbackElement: (
							<Loading showIndicator={false} message="Loading Agency dashboard..." />
						),
						children: [
							{
								path: '/agency',
								element: (
									<Suspense fallback={<Loading />}>
										<DashboardLayout />
									</Suspense>
								),

								children: [
									{
										index: true,
										lazy: () => import('@/features/agency/pages/Agency'),
										handle: {
											title: 'overview',
											headerContent: () => <Typography variant={'h4'}>Dashboard</Typography>,
										},
									},
									{
										path: 'fleet',
										lazy: () => import('@/features/fleet/pages/AgencyCars'),

										handle: {
											title: 'Fleet',
											headerContent: () => <FleetHeader />,
										},
									},
									{
										path: 'fleet/new',
										lazy: () => import('@/features/fleet/pages/AgencyCreateCar'),
										handle: {
											title: 'New car',
											headerContent: () => <FleetNewHeader />,
										},
									},
									{
										path: 'reservations',
										lazy: () => import('@/features/agency/pages/Reservations'),
									},
									{
										path: 'locations',
										lazy: () => import('@/features/agency/pages/Locations'),
									},
									{
										path: 'team',
										lazy: () => import('@/features/agency/pages/Team'),
									},
								],
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
