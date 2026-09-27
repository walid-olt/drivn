import { useMemo } from 'react';
import { format } from 'date-fns';
import { useSuspenseQueries } from '@tanstack/react-query';
import type { Agency, Car, Location as AgencyLocation, Reservation } from '@drivn/shared';

import apiClient from '@/lib/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';

const currency = new Intl.NumberFormat('fr-MA', {
	style: 'currency',
	currency: 'MAD',
	maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** Reservations that still occupy a vehicle or are expected to. */
const OPEN_RESERVATION_STATUSES = [
	'pending',
	'confirmed',
	'active',
] as const satisfies readonly Reservation['status'][];

export type AgencyKpiId =
	| 'fleet'
	| 'available'
	| 'utilization'
	| 'activeRentals'
	| 'upcomingPickups'
	| 'bookedValue';

export type AgencyKpi = {
	id: AgencyKpiId;
	label: string;
	value: string;
	hint: string;
	to: string;
};

const fetchAgency = async (): Promise<Agency> => {
	const [error, response] = await apiClient.agency.getActive();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};

const fetchCars = async (): Promise<Car[]> => {
	const [error, response] = await apiClient.cars.getAgencyCars();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};

const fetchReservations = async (): Promise<Reservation[]> => {
	const [error, response] = await apiClient.reservations.getAll();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};

const fetchLocations = async (): Promise<AgencyLocation[]> => {
	const [error, response] = await apiClient.locations.getAll();
	if (error) throw error;
	if (!response.success) throw new Error(response.message);
	return response.data;
};

const isOpen = (reservation: Reservation) =>
	(OPEN_RESERVATION_STATUSES as readonly Reservation['status'][]).includes(reservation.status);

/**
 * Reservation dates are coerced to `Date` by the shared schema, but the API
 * serialises them as ISO strings, so normalise before comparing.
 */
const toTime = (value: Date) => new Date(value).getTime();

/**
 * @description
 * Aggregates the agency's fleet, reservations and locations into the numbers the
 * overview page renders. The API exposes no reporting endpoint, so every KPI is
 * derived here from the same queries the rest of the dashboard already uses,
 * which keeps the overview in sync with the fleet and reservation lists.
 */
export function useAgencyOverview() {
	const [{ data: agency }, { data: cars }, { data: reservations }, { data: locations }] =
		useSuspenseQueries({
			queries: [
				{ queryKey: QUERY_KEYS.agency, queryFn: fetchAgency },
				{ queryKey: ['cars'], queryFn: fetchCars },
				{ queryKey: QUERY_KEYS.reservations, queryFn: fetchReservations },
				{ queryKey: ['locations'], queryFn: fetchLocations },
			],
		});

	const kpis = useMemo<AgencyKpi[]>(() => {
		const now = Date.now();
		const activeCars = cars.filter((car) => car.status !== 'inactive');
		const availableCars = cars.filter((car) => car.status === 'available');
		const inMaintenance = cars.filter((car) => car.status === 'maintenance');
		const openReservations = reservations.filter(isOpen);
		const activeRentals = reservations.filter((reservation) => reservation.status === 'active');
		const upcomingPickups = openReservations
			.filter((reservation) => toTime(reservation.startDate) >= now)
			.toSorted((a, b) => toTime(a.startDate) - toTime(b.startDate));
		const bookedValue = openReservations.reduce(
			(total, reservation) => total + reservation.totalAmount,
			0,
		);
		const utilization = activeCars.length
			? Math.round(((activeCars.length - availableCars.length) / activeCars.length) * 100)
			: 0;

		return [
			{
				id: 'fleet',
				label: 'Total vehicles',
				value: String(cars.length),
				hint: inMaintenance.length
					? `${inMaintenance.length} in maintenance`
					: 'Nothing in maintenance',
				to: '/agency/fleet',
			},
			{
				id: 'available',
				label: 'Ready to rent',
				value: String(availableCars.length),
				hint: cars.length
					? `${percent.format((availableCars.length / cars.length) * 100)}% of your fleet`
					: 'Add your first vehicle',
				to: '/agency/fleet',
			},
			{
				id: 'utilization',
				label: 'Fleet utilization',
				value: `${percent.format(utilization)}%`,
				hint: `Across ${agency.operatingLocationIds.length} active location${
					agency.operatingLocationIds.length === 1 ? '' : 's'
				}`,
				to: '/agency/locations',
			},
			{
				id: 'activeRentals',
				label: 'Active rentals',
				value: String(activeRentals.length),
				hint: `${openReservations.length} open reservation${
					openReservations.length === 1 ? '' : 's'
				}`,
				to: '/agency/reservations',
			},
			{
				id: 'upcomingPickups',
				label: 'Upcoming pickups',
				value: String(upcomingPickups.length),
				hint: upcomingPickups.length
					? `Next one ${format(toTime(upcomingPickups[0].startDate), 'd MMM')}`
					: 'Nothing scheduled ahead',
				to: '/agency/reservations',
			},
			{
				id: 'bookedValue',
				label: 'Booked value',
				value: currency.format(bookedValue),
				hint: 'Across all open reservations',
				to: '/agency/reservations',
			},
		];
	}, [agency.operatingLocationIds.length, cars, reservations]);

	return {
		agency,
		cars,
		reservations,
		locations,
		kpis,
	};
}
