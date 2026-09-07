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

type TypographySkeletonProps = Omit<TypographyOwnProps<'span'>, 'as' | 'children'> & {
	/**
	 * Optional copy used only to give the shimmer an intrinsic width.
	 * Prefer a width utility such as `w-48` when the loaded copy is dynamic.
	 */
	children?: ReactNode;
};

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

function TypographySkeleton({
	variant = 'body',
	className,
	children,
	...props
}: TypographySkeletonProps) {
	return (
		<Typography
			as="span"
			variant={variant}
			className={cn(
				'shimmer shimmer-bg shimmer-duration-1000  rounded-(--radius) text-transparent inline-block',
				className,
			)}
			{...props}
			aria-hidden="true"
		>
			{children ?? '\u00a0'}
		</Typography>
	);
}

export { Typography, TypographySkeleton, typographyVariants };
