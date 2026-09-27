import { BuildingsIcon, MapPinIcon, EnvelopeSimpleIcon } from '@phosphor-icons/react';
import type { Agency } from '@drivn/shared';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import { getInitials } from '@/lib/utils';

type AgencyBannerProps = {
	agency: Agency;
};

/**
 * @description
 * YouTube style channel header: a wide agency banner with the logo, name and
 * summary sitting underneath it. Falls back to a branded gradient whenever the
 * agency has not uploaded branding yet, and to initials when it has no logo.
 */
export default function AgencyBanner({ agency }: AgencyBannerProps) {
	const { banner, logo, name, summary, supportEmail, address } = agency;
	const location = [address?.city, address?.zipCode].filter(Boolean).join(', ');

	return (
		<section className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
			<div className="relative h-32 bg-linear-to-br from-primary/85 via-primary/60 to-primary/25 sm:h-44 lg:h-52">
				{banner ? (
					<img
						src={banner}
						alt=""
						className="size-full object-cover"
						loading="lazy"
						referrerPolicy="no-referrer"
					/>
				) : null}
				<div
					className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent"
					aria-hidden="true"
				/>
			</div>

			<div className="flex flex-col gap-4 px-4 pb-5 sm:px-6 sm:pb-6">
				<div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:gap-5">
					<Avatar size="lg" className="size-20 shrink-0 rounded-2xl ring-4 ring-card sm:size-24">
						{logo ? <AvatarImage src={logo} alt={`${name} logo`} /> : null}
						<AvatarFallback className="rounded-2xl bg-primary text-xl font-medium text-primary-foreground">
							{logo ? name.slice(0, 1).toUpperCase() : getInitials(name) || <BuildingsIcon />}
						</AvatarFallback>
					</Avatar>

					<div className="flex min-w-0 flex-col gap-1 sm:pb-1">
						<Typography as="h1" variant="h3" className="truncate">
							{name}
						</Typography>
						{summary ? (
							<Typography variant="caption" className="line-clamp-2 max-w-2xl">
								{summary}
							</Typography>
						) : null}
					</div>
				</div>

				{location || supportEmail ? (
					<div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
						{location ? (
							<span className="flex items-center gap-1.5">
								<MapPinIcon className="size-4" />
								{location}
							</span>
						) : null}
						{supportEmail ? (
							<a
								href={`mailto:${supportEmail}`}
								className="flex items-center gap-1.5 underline-offset-4 hover:underline"
							>
								<EnvelopeSimpleIcon className="size-4" />
								{supportEmail}
							</a>
						) : null}
					</div>
				) : null}
			</div>
		</section>
	);
}
