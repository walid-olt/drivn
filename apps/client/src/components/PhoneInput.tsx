import * as React from 'react';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
	Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
		onChange?: (value: RPNInput.Value) => void;
	};

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
	React.ElementRef<typeof RPNInput.default>,
	PhoneInputProps
>(({ className, onChange, value, placeholder = 'Phone number', ...props }, ref) => {
	return (
		<RPNInput.default
			ref={ref}
			className={cn(
				'group/phone relative flex h-7 w-full min-w-0 items-center overflow-hidden rounded-md border border-border bg-input/20 transition-colors outline-none',
				'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30',
				'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive/20',
				'dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
				className,
			)}
			countrySelectComponent={CountrySelect}
			flagComponent={FlagComponent}
			inputComponent={InputComponent}
			smartCaret={false}
			placeholder={placeholder}
			value={value || undefined}
			/**
			 * Handles the onChange event.
			 *
			 * react-phone-number-input might trigger the onChange event as undefined
			 * when a valid phone number is not entered. To prevent this,
			 * the value is coerced to an empty string.
			 *
			 * @param {E164Number | undefined} value - The entered value
			 */
			onChange={(value) => onChange?.(value || ('' as RPNInput.Value))}
			{...props}
		/>
	);
});
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, ...props }, ref) => (
		<Input
			data-slot="input-group-control"
			className={cn(
				'flex-1 rounded-none border-0 bg-transparent px-2 shadow-none ring-0 focus-visible:border-ring focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
				className,
			)}
			{...props}
			ref={ref}
		/>
	),
);
InputComponent.displayName = 'InputComponent';

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
	disabled?: boolean;
	value: RPNInput.Country;
	options: CountryEntry[];
	onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
	disabled,
	value: selectedCountry,
	options: countryList,
	onChange,
}: CountrySelectProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Popover
			open={isOpen}
			modal
			onOpenChange={(open) => {
				setIsOpen(open);
			}}
		>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						disabled={disabled}
						className="flex h-full shrink-0 rounded-none border-r border-border bg-transparent px-2 hover:bg-transparent"
					>
						<FlagComponent country={selectedCountry} countryName={selectedCountry} />
						<CaretDownIcon className="size-3.5 text-muted-foreground" />
					</Button>
				}
			/>
			<PopoverContent className="w-80 p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							{countryList.map(({ value, label }) =>
								value ? (
									<CountrySelectOption
										key={value}
										country={value}
										countryName={label}
										selectedCountry={selectedCountry}
										onChange={onChange}
										onSelectComplete={() => setIsOpen(false)}
									/>
								) : null,
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
	selectedCountry: RPNInput.Country;
	onChange: (country: RPNInput.Country) => void;
	onSelectComplete: () => void;
}

const CountrySelectOption = ({
	country,
	countryName,
	selectedCountry,
	onChange,
	onSelectComplete,
}: CountrySelectOptionProps) => {
	const handleSelect = () => {
		onChange(country);
		onSelectComplete();
	};

	return (
		<CommandItem
			value={countryName}
			onSelect={handleSelect}
			className="gap-2 [&>svg:last-child]:hidden"
		>
			<FlagComponent country={country} countryName={countryName} />
			<span className="flex-1 text-sm">{countryName}</span>
			<span className="text-xs text-muted-foreground/70">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
			<CheckIcon
				className={cn(
					'size-4 shrink-0',
					country === selectedCountry ? 'text-primary opacity-100' : 'opacity-0',
				)}
			/>
		</CommandItem>
	);
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};

export { PhoneInput };
