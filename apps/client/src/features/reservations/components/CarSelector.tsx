import { useMemo } from 'react';
import {
	CheckCircleIcon,
	GaugeIcon,
	UsersThreeIcon,
	WrenchIcon,
	KeyIcon,
} from '@phosphor-icons/react';
import type { Car } from '@drivn/shared';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

const currency = new Intl.NumberFormat('fr-MA', {
	style: 'currency',
	currency: 'MAD',
	maximumFractionDigits: 0,
});

/** Only vehicles that are actually bookable may be selected. */
const SELECTABLE_STATUSES = ['available'] as const satisfies readonly Car['status'][];

const UNAVAILABLE_LABELS: Record<Exclude<Car['status'], 'available'>, string> = {
	rented: 'Currently rented',
	maintenance: 'In maintenance',
	inactive: 'Inactive',
};

const TRANSMISSION_LABELS: Record<Car['transmission'], string> = {
	automatic: 'Automatic',
	manual: 'Manual',
	'semi-automatic': 'Semi-auto',
};

const FUEL_LABELS: Record<Car['fuelType'], string> = {
	gasoline: 'Gasoline',
	diesel: 'Diesel',
	electric: 'Electric',
	hybrid: 'Hybrid',
	'plug-in-hybrid': 'Plug-in hybrid',
};

const CATEGORY_LABELS: Record<Car['category'], string> = {
	sedan: 'Sedan',
	suv: 'SUV',
	hatchback: 'Hatchback',
	coupe: 'Coupe',
	convertible: 'Convertible',
	minivan: 'Minivan',
	luxury: 'Luxury',
};

export const isCarSelectable = (car: Car) =>
	(SELECTABLE_STATUSES as readonly Car['status'][]).includes(car.status);

type CarCardProps = {
	car: Car;
	selected: boolean;
};

function CarCard({ car, selected }: CarCardProps) {
	const selectable = isCarSelectable(car);
	const statusLabel = car.status === 'available' ? 'Available' : UNAVAILABLE_LABELS[car.status];

	return (
		<label
			data-slot="car-card"
			data-selected={selected}
			aria-disabled={!selectable}
			className={cn(
				'group/car relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-card ring-1 ring-foreground/10 transition-colors',
				selectable
					? 'hover:border-primary/50 focus-within:border-primary'
					: 'cursor-not-allowed opacity-60',
				selected ? 'border-primary bg-primary/5' : 'border-transparent',
			)}
		>
			{/* The radio input itself is visually hidden; the card is the click target. */}
			<RadioGroupItem value={car._id} className="sr-only" disabled={!selectable} />

			<div className="relative bg-muted">
				<AspectRatio ratio={16 / 9}>
					<img
						src={car.images[0]}
						alt={`${car.make} ${car.model}`}
						className="size-full object-cover"
						loading="lazy"
					/>
				</AspectRatio>
				<Badge
					variant="secondary"
					className="absolute top-2 left-2 bg-background/85 backdrop-blur-sm"
				>
					{CATEGORY_LABELS[car.category]}
				</Badge>
				{selected ? (
					<span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
						<CheckCircleIcon className="size-4" weight="fill" />
					</span>
				) : null}
			</div>

			<div className="flex flex-1 flex-col gap-3 p-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-col">
						<Typography variant="label" className="truncate">
							{car.make} {car.model}
						</Typography>
						<Typography variant="caption" className="truncate text-xs">
							{car.year}
						</Typography>
					</div>
					<span className="shrink-0 text-sm font-medium tabular-nums whitespace-nowrap">
						{currency.format(car.dailyRate)}
						<span className="text-xs font-normal text-muted-foreground">/day</span>
					</span>
				</div>

				<div className="mt-auto flex items-center justify-between gap-2 border-t pt-2 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<UsersThreeIcon className="size-3.5" />
						{car.seatingCapacity}
					</span>
					<span className="flex items-center gap-1">
						<KeyIcon className="size-3.5" />
						{TRANSMISSION_LABELS[car.transmission]}
					</span>
					<span className="flex items-center gap-1">
						<GaugeIcon className="size-3.5" />
						{FUEL_LABELS[car.fuelType]}
					</span>
				</div>

				{!selectable ? (
					<Badge variant="outline" className="w-fit gap-1 text-amber-600 dark:text-amber-400">
						<WrenchIcon className="size-3" />
						{statusLabel}
					</Badge>
				) : null}
			</div>
		</label>
	);
}

type CarSelectorProps = {
	cars: Car[];
	value: string | undefined;
	onChange: (carId: string) => void;
	invalid?: boolean;
};

/**
 * @description
 * Cars are a visual choice, so they are rendered as a radio grid instead of a
 * text dropdown. Arrow keys move between cards (Base UI's RadioGroup), and the
 * whole card acts as the click target via the wrapping label.
 */
export default function CarSelector({ cars, value, onChange, invalid }: CarSelectorProps) {
	// Show bookable cars first so they are not buried under unavailable ones.
	const orderedCars = useMemo(
		() => [...cars].toSorted((a, b) => Number(isCarSelectable(b)) - Number(isCarSelectable(a))),
		[cars],
	);

	const availableCount = useMemo(() => cars.filter(isCarSelectable).length, [cars]);

	if (cars.length === 0) {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<KeyIcon />
					</EmptyMedia>
					<EmptyTitle>No cars in your fleet</EmptyTitle>
					<EmptyDescription>
						Add a vehicle to your fleet before creating a reservation.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<Typography variant="caption">
				{availableCount} of {cars.length} vehicle{cars.length === 1 ? '' : 's'} available
			</Typography>
			<RadioGroup
				value={value ?? null}
				onValueChange={onChange}
				aria-invalid={invalid || undefined}
				className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
			>
				{orderedCars.map((car) => (
					<CarCard key={car._id} car={car} selected={car._id === value} />
				))}
			</RadioGroup>
		</div>
	);
}
