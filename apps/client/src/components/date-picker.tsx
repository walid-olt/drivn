import * as React from 'react';
import { useMemo } from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import type { Matcher } from 'react-day-picker';
import { CaretDownIcon, XIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type Props = {
	/** The currently selected date, or `undefined` when the field is empty. */
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	/** Earliest selectable day (inclusive). */
	minDate?: Date | undefined;
	/** Latest selectable day (inclusive). */
	maxDate?: Date | undefined;
	/** Forwarded to the trigger so `<Label htmlFor>` and RHF refs keep working. */
	id?: string;
	disabled?: boolean;
	'aria-invalid'?: boolean | 'grammar' | 'spelling';
	className?: string;
	triggerRef?: React.Ref<HTMLButtonElement>;
} & Omit<
	React.ComponentProps<typeof Calendar>,
	'mode' | 'selected' | 'onSelect' | 'className' | 'disabled'
>;

/**
 * @description
 * Single-date popover picker. The popup is controlled so it closes as soon as a
 * day is picked, and the trigger is a real button so it can receive an `id`
 * (label association), an `aria-invalid` state and a ref for focus management.
 *
 * react-day-picker v10 has no `min`/`max` props, so bounds are expressed as a
 * `disabled` matcher, which is the only supported way to grey out days.
 */
export function DatePicker({
	value,
	onChange,
	placeholder = 'Pick a date',
	minDate,
	maxDate,
	id,
	disabled,
	'aria-invalid': ariaInvalid,
	className,
	triggerRef,
	...calendarProps
}: Props) {
	const [open, setOpen] = React.useState(false);

	// `before`/`after` matchers are strict, so the boundary day stays selectable.
	const matchers = useMemo(() => {
		const result: Matcher[] = [];
		if (minDate) result.push({ before: startOfDay(minDate) });
		if (maxDate) result.push({ after: startOfDay(maxDate) });
		return result;
	}, [minDate, maxDate]);

	const handleSelect = (date: Date | undefined) => {
		// Defensive: a stale popover can still hand back a day that is out of range.
		if (date && ((minDate && isBefore(date, minDate)) || (maxDate && isAfter(date, maxDate)))) {
			return;
		}
		onChange(date);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						id={id}
						ref={triggerRef}
						disabled={disabled}
						aria-invalid={ariaInvalid}
						variant="outline"
						data-empty={!value}
						className={cn(
							'w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
							className,
						)}
					>
						{value ? format(value, 'PPP') : <span>{placeholder}</span>}
						<CaretDownIcon data-icon="inline-end" />
					</Button>
				}
			/>
			<PopoverContent className="w-auto gap-2 p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleSelect}
					disabled={matchers.length ? matchers : undefined}
					{...calendarProps}
				/>
				{value ? (
					<div className="flex items-center justify-between gap-2 border-t p-2">
						<Typography variant="caption">{format(value, 'PPP')}</Typography>
						<Button
							type="button"
							variant="ghost"
							size="xs"
							onClick={() => handleSelect(undefined)}
						>
							<XIcon />
							Clear
						</Button>
					</div>
				) : null}
			</PopoverContent>
		</Popover>
	);
}

export default DatePicker;
