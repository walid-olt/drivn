import * as React from 'react';
import { format } from 'date-fns';
import { CaretDownIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
} & React.ComponentProps<typeof Calendar>;
export function DatePicker({ value, onChange, ...rest }: Props) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant={'outline'}
						data-empty={!value}
						className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
					>
						{value ? format(value, 'PPP') : <span>Pick a date</span>}
						<CaretDownIcon data-icon="inline-end" />
					</Button>
				}
			/>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar {...rest} mode="single" selected={value} onSelect={onChange} />
			</PopoverContent>
		</Popover>
	);
}
