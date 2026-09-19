import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
	CheckCircleIcon,
	DotsThreeIcon,
	KeyIcon,
	ProhibitIcon,
	WrenchIcon,
} from '@phosphor-icons/react';

type CarStatus = 'available' | 'rented' | 'maintenance' | 'inactive';

type Car = {
	_id: string;
	organizationId: string;
	agencyId: string;
	make: string;
	model: string;
	year: number;
	status: CarStatus;
	category: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'minivan' | 'luxury';
	transmission: 'automatic' | 'manual' | 'semi-automatic';
	fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in-hybrid';
	seatingCapacity: number;
	doors: number;
	kilometrage: number;
	dailyRate: number;
	images: string[];
	vin?: string;
	licensePlate?: string;
	color?: string;
};

// Map each status to a badge treatment. Swap these tokens for your
// Space Indigo / Magenta Bloom / Fiery Terracotta / Shadow Grey palette
// once they're wired up as Tailwind theme colors.
const STATUS_STYLES: Record<CarStatus, string> = {
	available: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
	rented: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30 ',
	maintenance: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
	inactive: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

const STATUS_LABELS: Record<CarStatus, string> = {
	available: 'Available',
	rented: 'Rented',
	maintenance: 'Maintenance',
	inactive: 'Inactive',
};

const STATUS_ICONS: Record<CarStatus, typeof CheckCircleIcon> = {
	available: CheckCircleIcon,
	rented: KeyIcon,
	maintenance: WrenchIcon,
	inactive: ProhibitIcon,
};

const currency = new Intl.NumberFormat('fr-MA', {
	style: 'currency',
	currency: 'MAD',
	maximumFractionDigits: 0,
});

const km = new Intl.NumberFormat('fr-MA');

function CarThumbnail({ car }: { car: Car }) {
	const src = car.images?.[0];
	return (
		<Avatar className="h-10 w-10 rounded-md">
			<AvatarImage src={src} alt={`${car.make} ${car.model}`} className="object-cover rounded-sm" />
		</Avatar>
	);
}

export function FleetTable({
	cars,
	onChangeStatus,
	emptyMessage = 'No vehicles in this fleet yet.',
}: {
	cars: Car[];
	onChangeStatus?: (car: Car, status: CarStatus) => void;
	emptyMessage?: string;
}) {
	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="">Vehicle</TableHead>
						<TableHead></TableHead>
						<TableHead>Plate</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Category</TableHead>
						<TableHead className="text-right">Daily rate</TableHead>
						<TableHead className="text-right">Mileage</TableHead>
						<TableHead className="w-10"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{cars.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						cars.map((car) => (
							<TableRow key={car._id}>
								<TableCell>
									<CarThumbnail car={car} />
								</TableCell>
								<TableCell>
									<div className="font-medium">
										{car.year} {car.make} {car.model}
									</div>
									<div className="text-xs text-muted-foreground capitalize">
										{car.transmission} · {car.fuelType.replace('-', ' ')}
									</div>
								</TableCell>
								<TableCell className="font-mono text-sm">
									{car.licensePlate?.length === 0 ? '-' : car.licensePlate}
								</TableCell>
								<TableCell>
									<Badge variant="outline" className={STATUS_STYLES[car.status]}>
										<span
											className={car.status === 'rented' ? 'shimmer shimmer-color-fuchsia-100' : ''}
										>
											{car.status}
										</span>
									</Badge>
								</TableCell>
								<TableCell className="capitalize text-sm">{car.category}</TableCell>
								<TableCell className="text-right font-medium">
									{currency.format(car.dailyRate)}
								</TableCell>
								<TableCell className="text-right text-sm text-muted-foreground">
									{km.format(car.kilometrage)} km
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
												{(Object.keys(STATUS_LABELS) as CarStatus[]).map((status) => {
													const StatusIcon = STATUS_ICONS[status];
													return (
														<DropdownMenuItem
															key={status}
															disabled={status === car.status}
															onClick={() => onChangeStatus?.(car, status)}
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
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
