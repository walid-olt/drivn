import { Link } from 'react-router';
import {
	ArrowRightIcon,
	CalendarCheckIcon,
	CarIcon,
	CheckCircleIcon,
	MapPinIcon,
	SparkleIcon,
	UsersThreeIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';

const sampleBookings = [
	{
		id: 'res-1',
		renter: 'Karim Bennani',
		phone: '+212 661-234567',
		car: '2024 Mercedes-Benz C220d',
		category: 'Sedan · Diesel',
		route: 'Casablanca Airport → Marrakech Menara',
		dates: 'Sep 25 – Sep 29 (4 days)',
		total: '2,600 MAD',
		rate: '650 MAD/day',
		status: 'active',
	},
	{
		id: 'res-2',
		renter: 'Sarah Jenkins',
		phone: '+44 7700 900123',
		car: '2023 Hyundai Tucson',
		category: 'SUV · Automatic',
		route: 'Tangier City Port → Tangier Airport',
		dates: 'Sep 26 – Oct 01 (5 days)',
		total: '2,250 MAD',
		rate: '450 MAD/day',
		status: 'confirmed',
	},
	{
		id: 'res-3',
		renter: 'Mehdi Alami',
		phone: '+212 663-889900',
		car: '2024 Renault Clio V',
		category: 'Hatchback · Manual',
		route: 'Rabat Agdal → Same Branch',
		dates: 'Oct 02 – Oct 05 (3 days)',
		total: '900 MAD',
		rate: '300 MAD/day',
		status: 'pending',
	},
];

const features = [
	{
		icon: CarIcon,
		title: 'Fleet Command',
		description:
			'Track every vehicle across your lineup. Monitor mileage, transmission, fuel type, daily pricing, and live availability at a glance.',
		tag: 'Live telemetry',
	},
	{
		icon: CalendarCheckIcon,
		title: 'Dispatch & Reservations',
		description:
			'Seamless booking pipeline from pending to confirmed, keys-in-hand, and return. Compute multi-day rates and manage customer details with zero friction.',
		tag: 'Real-time lifecycle',
	},
	{
		icon: MapPinIcon,
		title: 'Multi-Branch Logistics',
		description:
			'Configure airport counters, city stations, and downtown garages. Dispatch vehicles and handle one-way drop-offs effortlessly.',
		tag: 'Branch routing',
	},
	{
		icon: UsersThreeIcon,
		title: 'Team & Counter Access',
		description:
			'Invite dispatchers, front-desk agents, and fleet managers with role-based permissions. Keep everyone aligned on pickups and handovers.',
		tag: 'Role permissions',
	},
];

const steps = [
	{
		number: '01',
		title: 'Set up your agency',
		description:
			'Define your agency profile, upload your branding, and register your operating branches across airport and city hubs.',
	},
	{
		number: '02',
		title: 'Onboard your fleet',
		description:
			'Add your vehicles with daily rates, license plates, seating, and specifications ready for immediate customer booking.',
	},
	{
		number: '03',
		title: 'Dispatch & accelerate',
		description:
			'Create reservations, transition statuses in real time, and oversee daily returns with full revenue clarity.',
	},
];

const Home = () => {
	return (
		<div className="flex flex-col gap-20 py-8 sm:gap-28 sm:py-12 lg:gap-32">
			{/* Hero Section */}
			<section className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
					<SparkleIcon className="size-3.5 animate-pulse" />
					<span>The modern operating system for car rental agencies</span>
				</div>

				<h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
					Run your car rental agency on high gear.
				</h1>

				<p className="mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
					Fleet inventory, instant reservation dispatch, multi-branch coverage, and counter team
					permissions — unified in one fast, precision-built workspace.
				</p>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button
						size="lg"
						render={<Link to="/register/agency" />}
						nativeButton={false}
						className="h-10 px-5 text-sm shadow-md shadow-primary/20"
					>
						Start agency setup
						<ArrowRightIcon className="ml-1 size-4" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						render={<Link to="/login" />}
						nativeButton={false}
						className="h-10 px-5 text-sm"
					>
						Sign in to workspace
					</Button>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<CheckCircleIcon className="size-4 text-emerald-500" />
						Instant agency onboarding
					</span>
					<span className="flex items-center gap-1.5">
						<CheckCircleIcon className="size-4 text-emerald-500" />
						Multi-location coverage
					</span>
					<span className="flex items-center gap-1.5">
						<CheckCircleIcon className="size-4 text-emerald-500" />
						Automated daily rate calculations
					</span>
				</div>

				{/* Signature Control Deck Preview */}
				<div className="mt-14 w-full overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-xl shadow-foreground/5">
					{/* Control deck header */}
					<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 bg-muted/30 px-5 py-3.5">
						<div className="flex items-center gap-3">
							<span className="flex size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
							<div>
								<div className="text-sm font-semibold text-foreground">Atlas Mobility Group</div>
								<div className="text-xs text-muted-foreground">
									Casablanca Airport Hub · Live Dispatch
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline" className="border-border bg-background px-2.5 py-1 text-xs">
								<span className="font-semibold text-foreground">18</span>
								<span className="ml-1 text-muted-foreground">Vehicles</span>
							</Badge>
							<Badge
								variant="outline"
								className="border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-500"
							>
								<span className="shimmer shimmer-color-emerald-100 font-semibold">12 Rented</span>
							</Badge>
							<Badge
								variant="outline"
								className="border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-400"
							>
								<span className="font-semibold">5 Available</span>
							</Badge>
							<Badge
								variant="outline"
								className="border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs text-orange-400"
							>
								<span className="font-semibold">1 Service</span>
							</Badge>
						</div>
					</div>

					{/* Control deck table preview */}
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs">
							<thead className="border-b border-border/60 bg-muted/15 text-muted-foreground">
								<tr>
									<th className="px-5 py-2.5 font-medium">Renter</th>
									<th className="px-5 py-2.5 font-medium">Vehicle</th>
									<th className="px-5 py-2.5 font-medium">Route</th>
									<th className="px-5 py-2.5 font-medium">Period</th>
									<th className="px-5 py-2.5 font-medium">Status</th>
									<th className="px-5 py-2.5 text-right font-medium">Total</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/60">
								{sampleBookings.map((b) => (
									<tr key={b.id} className="transition-colors hover:bg-muted/20">
										<td className="px-5 py-3">
											<div className="font-medium text-foreground">{b.renter}</div>
											<div className="text-[11px] text-muted-foreground">{b.phone}</div>
										</td>
										<td className="px-5 py-3">
											<div className="font-medium text-foreground">{b.car}</div>
											<div className="text-[11px] text-muted-foreground capitalize">
												{b.category}
											</div>
										</td>
										<td className="px-5 py-3 text-muted-foreground">{b.route}</td>
										<td className="px-5 py-3">
											<div className="text-foreground">{b.dates}</div>
										</td>
										<td className="px-5 py-3">
											{b.status === 'active' && (
												<Badge
													variant="outline"
													className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
												>
													<span className="shimmer shimmer-color-emerald-100">Active</span>
												</Badge>
											)}
											{b.status === 'confirmed' && (
												<Badge
													variant="outline"
													className="border-indigo-500/30 bg-indigo-500/15 text-indigo-400"
												>
													Confirmed
												</Badge>
											)}
											{b.status === 'pending' && (
												<Badge
													variant="outline"
													className="border-amber-500/30 bg-amber-500/15 text-amber-400"
												>
													Pending
												</Badge>
											)}
										</td>
										<td className="px-5 py-3 text-right">
											<div className="font-medium text-foreground">{b.total}</div>
											<div className="text-[11px] text-muted-foreground">{b.rate}</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Control deck footer telemetry bar */}
					<div className="grid grid-cols-2 gap-4 border-t border-border/80 bg-muted/20 px-5 py-3 sm:grid-cols-4">
						<div>
							<div className="text-[11px] text-muted-foreground">Fleet Utilization</div>
							<div className="text-sm font-semibold text-foreground">88.5%</div>
						</div>
						<div>
							<div className="text-[11px] text-muted-foreground">Avg. Daily Rate</div>
							<div className="text-sm font-semibold text-foreground">480 MAD</div>
						</div>
						<div>
							<div className="text-[11px] text-muted-foreground">Avg. Turnaround</div>
							<div className="text-sm font-semibold text-foreground">18 minutes</div>
						</div>
						<div>
							<div className="text-[11px] text-muted-foreground">Operating Locations</div>
							<div className="text-sm font-semibold text-foreground">4 Hubs Active</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Features Grid */}
			<section className="mx-auto w-full max-w-5xl">
				<div className="mb-10 text-center">
					<Typography
						variant="caption"
						className="font-mono tracking-widest text-primary uppercase"
					>
						Capabilities
					</Typography>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						Built for every step of the rental lifecycle.
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						No clunky spreadsheets, no disjointed tools. Everything your counter and garage teams
						need.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-all hover:border-border hover:shadow-md"
							>
								<div>
									<div className="flex items-center justify-between">
										<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Icon className="size-5" />
										</div>
										<Badge variant="secondary" className="text-[10px]">
											{feature.tag}
										</Badge>
									</div>
									<h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
									<p className="mt-2 text-xs/relaxed text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Operational Workflow Section */}
			<section className="mx-auto w-full max-w-5xl rounded-2xl border border-border/80 bg-muted/20 px-6 py-10 sm:px-10 sm:py-14">
				<div className="mb-10 max-w-xl">
					<Typography
						variant="caption"
						className="font-mono tracking-widest text-primary uppercase"
					>
						Simple Workflow
					</Typography>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						Up and running in 3 clear steps.
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Onboard your fleet today and start managing live customer reservations without complex
						training.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-3">
					{steps.map((step) => (
						<div key={step.number} className="flex flex-col">
							<span className="font-mono text-xs font-semibold text-primary">{step.number}</span>
							<h4 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h4>
							<p className="mt-1.5 text-xs/relaxed text-muted-foreground">{step.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* Bottom CTA Block */}
			<section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card to-muted/30 p-8 text-center sm:p-12">
				<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					Ready to take your agency into the fast lane?
				</h2>
				<p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
					Create your agency profile, invite your dispatch team, and gain complete control over your
					fleet and bookings.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<Button
						size="lg"
						render={<Link to="/register/agency" />}
						nativeButton={false}
						className="h-10 px-5 text-sm shadow-md shadow-primary/20"
					>
						Create agency account
						<ArrowRightIcon className="ml-1 size-4" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						render={<Link to="/login" />}
						nativeButton={false}
						className="h-10 px-5 text-sm"
					>
						Sign in
					</Button>
				</div>
			</section>
		</div>
	);
};

export default Home;
