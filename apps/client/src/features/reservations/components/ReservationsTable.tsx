import { useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	CalendarCheckIcon,
	CarIcon,
	CheckCircleIcon,
	ClockCountdownIcon,
	DotsThreeIcon,
	KeyIcon,
	XCircleIcon,
} from '@phosphor-icons/react';
import { getAvatarColor, getInitials } from '@/lib/utils';
import type { Reservation, Car, Location as AgencyLocation } from '@drivn/shared';

type ReservationStatus = Reservation['status'];

const STATUS_STYLES: Record<ReservationStatus, string> = {
	pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
	confirmed: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
	active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
	completed: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
	cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
	pending: 'Pending',
	confirmed: 'Confirmed',
	active: 'Active',
	completed: 'Completed',
	cancelled: 'Cancelled',
};

const STATUS_ICONS: Record<ReservationStatus, React.ComponentType<{ className?: string }>> = {
	pending: ClockCountdownIcon,
	confirmed: CheckCircleIcon,
	active: KeyIcon,
	completed: CalendarCheckIcon,
	cancelled: XCircleIcon,
};

const currency = new Intl.NumberFormat('fr-MA', {
	style: 'currency',
	currency: 'MAD',
	maximumFractionDigits: 0,
});

function formatDateRange(startDate: string | Date, endDate: string | Date) {
	const start = new Date(startDate);
	const end = new Date(endDate);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		return `${String(startDate)} – ${String(endDate)}`;
	}

	const sameYear = start.getFullYear() === end.getFullYear();

	const startStr = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		...(!sameYear ? { year: 'numeric' } : {}),
	}).format(start);

	const endStr = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(end);

	return `${startStr} – ${endStr}`;
}

function CarThumbnail({ car }: { car: Car }) {
	const src = car.images?.[0];
	return (
		<Avatar className="h-10 w-10 rounded-md shrink-0">
			<AvatarImage
				src={src}
				alt={car ? `${car.make} ${car.model}` : 'Vehicle'}
				className="rounded-sm object-cover"
			/>
		</Avatar>
	);
}

export function ReservationsTable({
	reservations,
	cars = [],
	locations = [],
	onChangeStatus,
	emptyMessage = 'No reservations match these filters.',
}: {
	reservations: Reservation[];
	cars?: Car[];
	locations?: AgencyLocation[];
	onChangeStatus?: (reservation: Reservation, status: ReservationStatus) => void;
	emptyMessage?: string;
}) {
	const carsMap = useMemo(() => new Map(cars.map((c) => [c._id, c])), [cars]);
	const locationsMap = useMemo(() => new Map(locations.map((l) => [l._id, l])), [locations]);

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Renter</TableHead>
						<TableHead>Vehicle</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Locations</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Total</TableHead>
						<TableHead className="w-10"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reservations.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						reservations.map((reservation) => {
							const car = carsMap.get(reservation.carId);
							const pickupLocation = locationsMap.get(reservation.pickupLocationId);
							const dropoffLocation = locationsMap.get(reservation.dropoffLocationId);

							return (
								<TableRow key={reservation._id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-9 w-9">
												<AvatarFallback
													className="text-xs font-medium text-white"
													style={{
														backgroundColor: getAvatarColor(reservation.renterName),
													}}
												>
													{getInitials(reservation.renterName)}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0">
												<div className="font-medium truncate">{reservation.renterName}</div>
												<div className="text-xs text-muted-foreground truncate">
													{reservation.renterPhone || reservation.renterEmail || '—'}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-3">
											<CarThumbnail car={car} />
											<div className="min-w-0">
												<div className="font-medium truncate">
													{car ? `${car.year} ${car.make} ${car.model}` : 'Vehicle'}
												</div>
												<div className="text-xs text-muted-foreground capitalize truncate">
													{car
														? car.licensePlate
															? `${car.licensePlate} · ${car.category}`
															: car.category
														: '—'}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="text-sm font-medium">
											{formatDateRange(reservation.startDate, reservation.endDate)}
										</div>
										<div className="text-xs text-muted-foreground">
											{reservation.totalDays} {reservation.totalDays === 1 ? 'day' : 'days'}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col text-sm">
											<span className="font-medium truncate max-w-[180px]">
												{pickupLocation?.name ?? 'Pickup location'}
											</span>
											{dropoffLocation && dropoffLocation._id !== pickupLocation?._id ? (
												<span className="text-xs text-muted-foreground truncate max-w-[180px]">
													→ {dropoffLocation.name}
												</span>
											) : (
												<span className="text-xs text-muted-foreground">
													{pickupLocation?.city ?? 'Same location'}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={STATUS_STYLES[reservation.status]}>
											<span
												className={
													reservation.status === 'active' ? 'shimmer shimmer-color-emerald-100' : ''
												}
											>
												{STATUS_LABELS[reservation.status]}
											</span>
										</Badge>
									</TableCell>
									<TableCell className="text-right font-medium">
										<div>{currency.format(reservation.totalAmount)}</div>
										<div className="text-xs text-muted-foreground font-normal">
											{currency.format(reservation.dailyRate)}/day
										</div>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger
												render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
											>
												<DotsThreeIcon className="h-4 w-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuGroup>
													<DropdownMenuLabel>Change status</DropdownMenuLabel>
													{(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((status) => {
														const StatusIcon = STATUS_ICONS[status];
														return (
															<DropdownMenuItem
																key={status}
																disabled={status === reservation.status}
																onClick={() => onChangeStatus?.(reservation, status)}
															>
																<StatusIcon className="mr-2 h-4 w-4" />
																{STATUS_LABELS[status]}
															</DropdownMenuItem>
														);
													})}
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
}
