import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('text-foreground', {
	variants: {
		variant: {
			h1: 'text-4xl/tight font-medium tracking-tight md:text-5xl/tight',
			h2: 'text-3xl/tight font-medium tracking-tight md:text-4xl/tight',
			h3: 'text-2xl/snug font-medium tracking-tight md:text-3xl/snug',
			h4: 'text-xl/snug font-medium tracking-tight md:text-2xl/snug',
			body: 'text-base/relaxed text-muted-foreground',
			bodyStrong: 'text-base/relaxed font-medium',
			caption: 'text-sm/relaxed text-muted-foreground',
			label: 'text-sm font-medium text-foreground',
		},
	},
	defaultVariants: {
		variant: 'body',
	},
});

type TypographyOwnProps<T extends ElementType> = {
	as?: T;
	variant?: VariantProps<typeof typographyVariants>['variant'];
	children: ReactNode;
	className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * @description
 * Versatile Typography component for rendering text with various styles and
 * semantic HTML elements. It supports different variants like headings, body text,
 * captions, and labels, allowing for consistent typography across the application.
 */
function Typography<T extends ElementType = 'p'>({
	as,
	variant = 'body',
	className,
	children,
	...props
}: TypographyOwnProps<T>) {
	const Component = as ?? 'p';

	return (
		<Component
			data-slot="typography"
			className={cn(typographyVariants({ variant }), className)}
			{...props}
		>
			{children}
		</Component>
	);
}

export { Typography, typographyVariants };
