import { type RouteObject } from 'react-router';
import NoAgency from '@/features/agency/pages/NoAgency';
import EmailVerificationRequestPage from '@/pages/public/EmailVerificationRequestPage';
import requireUserAuth from '../../middleware/requireUserAuth';
import requireVerifiedUser from '../../middleware/requireVerifiedUser';
import requireAgencyMembership from '../../middleware/requireAgencyMembership';
import requireNoAgency from '../../middleware/requireNoAgency';
import requireAgencyOnboarding from '../../middleware/requireAgencyOnBoarding';
import CreateAgency from '@/features/agency/pages/CreateAgency';
import Loading from '@/components/ui/Loading';
import apiClient from '@/lib/api-client';
import AgencySetupCompleted from '@/features/agency/pages/AgencySetupCompleted';
import DashboardLayout from '@/features/agency/components/DashboardLayout';
import { Suspense } from 'react';
import { Typography } from '@/components/ui/typography';
import FleetHeader from '@/features/fleet/components/FleetHeader';
import { FleetNewHeader } from '@/features/fleet/components/FleetNewHeader';
import TeamHeader from '@/features/team/components/TeamHeader';
import AcceptInvitation from '@/features/agency/pages/AcceptInvitation';
import VerifyEmail from '@/pages/public/VerifyEmail';
import ReservationsHeader from '@/features/reservations/components/ReservationsHeader';
import { ReservationCreateHeader } from '@/features/reservations/components/ReservationCreateHeader';
import LocationsHeader from '@/features/location/components/LocationsHeader';

/**
 * @description
 * These are the protected routes for the agency CRM.
 * We use a nested route structure to apply middleware to groups of routes.
 */
export default [
	{
		middleware: [requireUserAuth],

		children: [
			{
				path: '/verify-email',
				element: <VerifyEmail />,
			},
			{
				middleware: [requireVerifiedUser],
				children: [
					{
						middleware: [requireAgencyMembership],
						hydrateFallbackElement: (
							<Loading showIndicator={false} message="Loading Agency dashboard..." />
						),
						children: [
							{
								path: '/agency',

								middleware: [requireAgencyOnboarding],
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
										lazy: () => import('@/features/reservations/pages/Reservations'),
										handle: {
											title: 'Reservations',
											headerContent: () => <ReservationsHeader />,
										},
									},
									{
										path: 'reservations/new',
										lazy: () => import('@/features/reservations/pages/ReservationCreate'),
										handle: {
											title: 'New reservation',
											headerContent: () => <ReservationCreateHeader />,
										},
									},
									{
										path: 'locations',
										lazy: () => import('@/features/location/pages/Locations'),
										handle: {
											title: 'Locations',
											headerContent: () => <LocationsHeader />,
										},
									},
									{
										path: 'team',
										lazy: () => import('@/features/team/pages/Team'),
										handle: {
											title: 'Team',
											headerContent: () => <TeamHeader />,
										},
									},
								],
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
			{
				path: '/verify-email/request',
				element: <EmailVerificationRequestPage />,
			},
		],
	},
] as RouteObject[];
