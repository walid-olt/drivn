import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { Location as AgencyLocation } from '@drivn/shared';
import type { LocationType } from '.';

const LOCATION_TYPE_VALUES: LocationType[] = [
	'office',
	'airport',
	'hotel',
	'train_station',
	'port',
	'other',
];

const normalize = (value: string) =>
	value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

const isLocationType = (value: string | null): value is LocationType =>
	value !== null && LOCATION_TYPE_VALUES.includes(value as LocationType);

export function useLocationFilterParams() {
	const [searchParams, setSearchParams] = useSearchParams();

	const search = searchParams.get('q') ?? '';
	const rawType = searchParams.get('type');
	const type: LocationType = isLocationType(rawType) ? rawType : 'all';
	const activeOnly = searchParams.get('active') === 'true';

	const updateParams = (updates: Record<string, string | null>, replace = false) => {
		const nextParams = new URLSearchParams(searchParams);
		for (const [key, value] of Object.entries(updates)) {
			if (value === null || value === '') nextParams.delete(key);
			else nextParams.set(key, value);
		}
		setSearchParams(nextParams, { replace });
	};

	const setSearch = (value: string) => updateParams({ q: value }, true);
	const setType = (value: LocationType) => updateParams({ type: value === 'all' ? null : value });
	const setActiveOnly = (value: boolean) => updateParams({ active: value ? 'true' : null });

	return { search, setSearch, type, setType, activeOnly, setActiveOnly };
}

export function useLocationFilters(locations: AgencyLocation[], selectedIds: Set<string>) {
	const { search, type, activeOnly, ...controls } = useLocationFilterParams();

	const normalizedSearch = normalize(search.trim());

	const visibleLocations = useMemo(
		() =>
			locations.filter((location) => {
				const matchesSearch =
					!normalizedSearch ||
					[
						location.name,
						location.address,
						location.city,
						location.country,
						location.type.replace('_', ' '),
					].some((value) => normalize(value).includes(normalizedSearch));
				const matchesType = type === 'all' || location.type === type;
				const matchesActive = !activeOnly || selectedIds.has(location._id);
				return matchesSearch && matchesType && matchesActive;
			}),
		[activeOnly, locations, normalizedSearch, selectedIds, type],
	);

	return { ...controls, search, type, activeOnly, visibleLocations };
}
