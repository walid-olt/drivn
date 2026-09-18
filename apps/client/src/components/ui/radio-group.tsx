import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';

import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			className={cn('grid gap-2', className)}
			{...props}
		/>
	);
}

function RadioGroupItem({ className, ...props }: Radio.Root.Props) {
	return (
		<Radio.Root
			data-slot="radio-group-item"
			className={cn(
				'flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background text-primary shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground',
				className,
			)}
			{...props}
		>
			<Radio.Indicator className="flex items-center justify-center data-unchecked:hidden after:block after:size-2 after:rounded-full after:bg-current" />
		</Radio.Root>
	);
}

export { RadioGroup, RadioGroupItem };
