'use client';
import { useMemo, useState } from 'react';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { CircleFlag } from 'react-circle-flags';
import { countries } from 'country-data-list';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Country {
	alpha2: string;
	alpha3: string;
	countryCallingCodes: string[];
	currencies: string[];
	emoji?: string;
	ioc: string;
	languages: string[];
	name: string;
	status: string;
}

interface CountryDropdownProps {
	/**
	 * The currently selected country, matched against `options` by name or alpha3.
	 */
	value?: string | null;
	onChange?: (country: Country) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

const defaultOptions = countries.all.filter(
	(country: Country) => country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK',
);

function resolveCountry(value: string | null | undefined, options: Country[]) {
	if (!value) return undefined;
	return options.find(
		(country) => country.alpha3 === value || country.name.toLowerCase() === value.toLowerCase(),
	);
}

export const CountryDropdown = ({
	value,
	onChange,
	placeholder = 'Select a country',
	disabled = false,
	className,
}: CountryDropdownProps) => {
	const [open, setOpen] = useState(false);
	const options = useMemo(() => defaultOptions, []);
	const selectedCountry = useMemo(() => resolveCountry(value, options), [value, options]);

	const handleSelect = (country: Country) => {
		onChange?.(country);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						disabled={disabled}
						className={cn(
							'group/combobox flex h-7 w-full items-center justify-between gap-2 rounded-md bg-input/20 px-2 text-left text-sm font-normal text-foreground transition-colors dark:bg-input/30',
							'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
							'data-popup-open:border-ring data-popup-open:ring-2 data-popup-open:ring-ring/30',
							'disabled:pointer-events-none disabled:opacity-50',
							className,
						)}
					>
						{selectedCountry ? (
							<span className="flex min-w-0 items-center gap-2">
								<CircleFlag
									countryCode={selectedCountry.alpha2.toLowerCase()}
									height={20}
									className="size-5 shrink-0"
								/>
								<span className="truncate">{selectedCountry.name}</span>
							</span>
						) : (
							<span className="text-muted-foreground">{placeholder}</span>
						)}
						<CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-popup-open/combobox:rotate-180" />
					</Button>
				}
			/>
			<PopoverContent className="w-80 p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							{options
								.filter((country) => country.name)
								.map((country) => (
									<CountryItem
										key={country.alpha3}
										country={country}
										selected={selectedCountry?.alpha3 === country.alpha3}
										onSelect={handleSelect}
									/>
								))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

function CountryItem({
	country,
	selected,
	onSelect,
}: {
	country: Country;
	selected: boolean;
	onSelect: (country: Country) => void;
}) {
	return (
		<CommandItem
			value={country.name}
			onSelect={() => onSelect(country)}
			className="gap-2 [&>svg:last-child]:hidden"
		>
			<CircleFlag
				countryCode={country.alpha2.toLowerCase()}
				height={20}
				className="size-5 shrink-0"
			/>
			<span className="flex-1 truncate text-sm">{country.name}</span>
			<span className="text-xs text-muted-foreground/70">{country.countryCallingCodes?.[0]}</span>
			<CheckIcon
				className={cn('size-4 shrink-0', selected ? 'text-primary opacity-100' : 'opacity-0')}
			/>
		</CommandItem>
	);
}
